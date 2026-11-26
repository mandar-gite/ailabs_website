# Contributing

**The branching, commit, merge and release rules for every 72ai repo live in 1 place:**
[`docs/GIT_STRATEGY.md`](https://github.com/72ailabs/72ai/blob/develop/docs/GIT_STRATEGY.md) in the `72ailabs/72ai` repo (`~/72ai/docs/GIT_STRATEGY.md` on coeus). Read it once before your first push.

The short version:

1. Pull requests target `develop`, never `main`. Only Mandar releases to `main`.
2. Branch from `develop` in a worktree: `feature/`, `fix/`, `docs/` or `chore/`, lowercase kebab-case, 2 to 4 words.
3. Conventional Commits: `type(scope): description`, 72 characters at most, imperative mood, no AI attribution.
4. Merge commits only, never squash. Delete the branch after the merge.
5. Never force-push, never `reset --hard` over unpushed work, never commit straight to `main` or `develop`.
6. Never commit `.env` files, keys, tokens or anyone's contact details.

In this repo: `main` and `develop` are protected: a PR and a green `test` check are required. Releases run through `/ship` and `/land-and-deploy` (see "Deploy Configuration" in `CLAUDE.md`).
