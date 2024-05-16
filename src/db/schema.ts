import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core";

export const like = sqliteTable('like', {
  slug: text('slug').primaryKey(),
  likes: integer('likes').default(0),
})
