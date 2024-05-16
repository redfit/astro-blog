import type { APIContext } from "astro";
import { eq } from "drizzle-orm";
import { db, likes } from "../../db";

export const prerender = false;

export async function GET(context: APIContext) {
  const { slug } = context.params;

  if (!slug) {
    return new Response("Bad Request", { status: 400 });
  }

  const entry = db.select().from(likes).where(eq(likes.slug, slug)).get();

  if (!entry) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(JSON.stringify(entry), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export async function post(context: APIContext) {
  const { slug } = context.params;

  if (!slug) {
    return new Response("Bad Request", { status: 400 });
  }

  const entry = db.select().from(likes).where(eq(likes.slug, slug)).get();

  if (!entry) {
    const inserted = db
      .insert(likes)
      .values({ slug, likes: 1 })
      .returning()
      .get();

    return new Response(JSON.stringify(inserted), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const updated = db
    .update(likes)
    .set({ likes: (entry.likes ?? 0) + 1 })
    .where(eq(likes.slug, slug))
    .returning()
    .get();

  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
