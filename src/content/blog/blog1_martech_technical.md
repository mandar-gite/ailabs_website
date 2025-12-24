---
title: "Building Multi-Agent AI Systems That Actually Work"
description: "A deep dive into building production-ready multi-agent RAG systems: architecture, quality loops, graceful degradation, and lessons learned from real implementations."
pubDate: 2025-12-24
author: "Mandar Gite"
category: "Technical Deep Dive"
tags: ["AI", "RAG", "multi-agent", "architecture", "engineering"]
featured: false
draft: false
---

# Building Multi-Agent AI Systems That Actually Work

Most AI content generators are glorified prompt wrappers. One prompt in, one output out. They work until they don't—and when they fail, they fail completely.

We built something different: a **multi-agent RAG system** where specialized AI agents collaborate, check each other's work, and fail gracefully when things go wrong. This post walks through the architecture, the design decisions, and the lessons learned.



## The Problem with Single-Agent Systems

A single LLM call is brittle. It has no memory beyond what you feed it, no way to verify its own output, and no fallback when the model hallucinates or the API fails.

For real business applications—where reliability matters—you need:
- **Retrieval**: Ground responses in your actual data
- **Specialization**: Different cognitive tasks need different approaches
- **Quality control**: Someone needs to check the work
- **Graceful degradation**: The system should limp forward, not crash

This led us to a multi-agent architecture with retrieval-augmented generation (RAG) at its core.

 
## System Architecture

Four specialized agents coordinate through an orchestrator:

```
┌─────────────────────────────────────────────────────────────────┐
│                     MULTI-AGENT ORCHESTRATOR                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│   │   PLANNER    │───▶│  RESEARCHER  │───▶│    WRITER    │      │
│   │    AGENT     │    │    AGENT     │    │    AGENT     │      │
│   └──────────────┘    └──────────────┘    └──────────────┘      │
│                              │                    │             │
│                              ▼                    ▼             │
│                       ┌──────────────┐    ┌──────────────┐      │
│                       │   CHROMADB   │    │   REVIEWER   │      │
│                       │ VECTOR STORE │    │    AGENT     │      │
│                       └──────────────┘    └──────────────┘      │
│                                                  │              │
│                                                  ▼              │
│                                          Quality < 0.7?         │
│                                           │         │           │
│                                          YES       NO           │
│                                           │         │           │
│                                     Loop Back    Output         │
└─────────────────────────────────────────────────────────────────┘
```

Each agent has a single responsibility:

| Agent | Responsibility | Output |
|-------|---------------|--------|
| **Planner** | Strategic content scheduling | Weekly calendar, topic sequencing |
| **Researcher** | Knowledge retrieval and synthesis | Contextual facts, trends, data |
| **Writer** | Content generation | Multiple drafts in different styles |
| **Reviewer** | Quality assessment | Scores, feedback, improvement suggestions |

---

## The RAG Pipeline: Grounding AI in Real Data

The Researcher Agent doesn't just make things up. It queries a vector database containing domain-specific knowledge using semantic similarity search.

**How it works:**

1. User query comes in: *"Write about AI adoption in Indian manufacturing"*
2. Query gets embedded using `sentence-transformers/all-MiniLM-L6-v2`
3. ChromaDB returns top-k semantically similar documents
4. Retrieved context gets injected into the LLM prompt
5. LLM generates grounded response

```python
class ResearchAgent:
    def __init__(self, collection_name: str = "knowledge_base"):
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.chroma_client = chromadb.PersistentClient(path="./data/vectors")
        self.collection = self.chroma_client.get_or_create_collection(
            name=collection_name,
            embedding_function=self._embedding_function()
        )
    
    async def research(self, topic: str, n_results: int = 5) -> Dict[str, Any]:
        # Multi-query retrieval for broader coverage
        queries = self._expand_query(topic)
        
        all_results = []
        for query in queries:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
            all_results.extend(self._deduplicate(results))
        
        return {
            "context": self._synthesize(all_results),
            "sources": [r["metadata"]["source"] for r in all_results],
            "confidence": self._calculate_confidence(all_results)
        }
```

**Key design decisions:**

- **Multi-query expansion**: A single query often misses relevant documents. We generate 3-5 query variants to improve recall.
- **Confidence scoring**: If retrieved documents have low similarity scores, the system flags the output as potentially unreliable.
- **Source tracking**: Every generated fact links back to its source document.



## The Iterative Quality Loop

The Reviewer Agent doesn't just rubber-stamp output. It scores content on multiple dimensions and triggers rewrites when quality falls below threshold.

```python
class ReviewAgent:
    QUALITY_THRESHOLD = 0.7
    MAX_ITERATIONS = 3
    
    async def review(self, content: str, context: Dict) -> Dict[str, Any]:
        scores = {
            "relevance": self._score_relevance(content, context["topic"]),
            "accuracy": self._score_against_sources(content, context["sources"]),
            "engagement": self._score_engagement(content),
            "clarity": self._score_readability(content)
        }
        
        overall = sum(scores.values()) / len(scores)
        
        return {
            "scores": scores,
            "overall": overall,
            "passed": overall >= self.QUALITY_THRESHOLD,
            "feedback": self._generate_feedback(scores) if overall < self.QUALITY_THRESHOLD else None
        }
```

The orchestrator runs the write-review loop up to three times. If content still doesn't pass after three iterations, it gets flagged for human review rather than being published.



## Graceful Degradation: The Mock System

What happens when the LLM service is down? When ChromaDB fails to connect? When the model starts hallucinating?

Most systems crash. Ours falls back to a template-based generator that maintains the same API contract:

```python
class MockContentGenerator:
    """Fallback when primary agents fail"""
    
    def __init__(self):
        self.templates = self._load_templates()
    
    async def generate(self, request: ContentRequest) -> ContentResponse:
        template = self._select_template(request.topic, request.style)
        
        return ContentResponse(
            content=self._fill_template(template, request),
            metadata={
                "source": "fallback_system",
                "confidence": 0.5,
                "warning": "Generated using template fallback"
            }
        )
```

The client gets content either way. The metadata tells them whether it came from the full system or the fallback, so they can decide whether to use it as-is or hold for review.



## Real-Time Streaming Architecture

For long-running generation tasks, users need feedback. Our system streams progress updates via Server-Sent Events:

```python
@router.post("/api/generate")
async def generate_content(request: ContentRequest):
    async def event_generator():
        yield {"event": "stage", "data": {"stage": "planning", "progress": 0.1}}
        
        plan = await planner.plan(request)
        yield {"event": "stage", "data": {"stage": "research", "progress": 0.3}}
        
        research = await researcher.research(plan.topic)
        yield {"event": "stage", "data": {"stage": "writing", "progress": 0.6}}
        
        content = await writer.write(plan, research)
        yield {"event": "stage", "data": {"stage": "review", "progress": 0.9}}
        
        final = await reviewer.review(content)
        yield {"event": "complete", "data": final}
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

The frontend shows a progress bar and stage indicators. Users know the system is working, not frozen.



## Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| API | FastAPI + Uvicorn | Async-first, streaming support |
| Vector DB | ChromaDB | Simple, file-based, no server needed |
| Embeddings | sentence-transformers | Runs locally, no API costs |
| LLM | LM Studio (Hermes-3-Llama-3.1-8B) | Local inference, full control |
| Background Tasks | Celery + Redis | Scalable async processing |
| Primary DB | PostgreSQL | Structured data, ACID compliance |

Everything runs on a single server. No cloud dependencies for core functionality. This keeps costs predictable and latency low.



## Lessons Learned

**1. Specialization beats generalization.** A single agent trying to do everything produces mediocre results. Four specialized agents produce better output than one "smart" agent.

**2. Always have a fallback.** AI systems fail in unpredictable ways. Design for graceful degradation from day one.

**3. Quality gates matter.** Without automated quality checks, you're just hoping the LLM got it right. The review loop catches obvious failures before they reach users.

**4. Stream everything.** Users assume frozen UIs mean crashed systems. Constant feedback keeps them informed and patient.

**5. Local models are viable.** For many use cases, a well-configured 8B parameter model running locally beats API calls to GPT-4. Lower latency, predictable costs, full control.



## What's Next

This architecture is the foundation. We're extending it with:
- **Domain-specific knowledge bases** for different industries
- **Feedback learning loops** that improve generation based on user edits
- **Multi-modal support** for image and document analysis
- **Integration connectors** for common Indian business platforms

The goal isn't to build the "smartest" AI. It's to build AI systems that reliably solve real operational problems—without the hype, without the abstraction.

That's what 72° AI Labs does. Practical AI for real business systems.



*If you're looking to implement AI that actually works with your existing data and systems, reach out [here](/#contact).*
