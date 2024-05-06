import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { getCollection } from "astro:content";

const parser = new MarkdownIt();
export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  return rss({
    title: "blog",
    description: "I write about web developer",
    site: context.site?.toString() || "http://localhost:4321",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.slug}`,
      content: sanitizeHtml(parser.render(post.body)),
    })),
  });
}
