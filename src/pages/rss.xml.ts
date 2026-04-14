import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);

  return rss({
    title: '72° AI Labs Blog',
    description: 'Practical AI insights, experiment logs, and real-world case studies for Indian SMBs.',
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        categories: post.data.tags,
        author: post.data.author || 'Mandar Gite',
      })),
    customData: '<language>en-in</language>',
  });
}
