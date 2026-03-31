import { pgTable, uuid, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';
import { media } from './media';

export const postCategories = pgTable('post_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name_ar: text('name_ar').notNull(),
  name_en: text('name_en').notNull(),
  slug: text('slug').notNull().unique(),
  description_ar: text('description_ar'),
  description_en: text('description_en'),
  sort_order: integer('sort_order').default(0),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  category_id: uuid('category_id').references(() => postCategories.id),
  author_id: uuid('author_id').notNull().references(() => accounts.id),
  title_ar: text('title_ar').notNull().default(''),
  title_en: text('title_en').notNull().default(''),
  slug: text('slug').notNull().unique(),
  slug_ar: text('slug_ar'),
  slug_en: text('slug_en'),
  content_ar: text('content_ar').default(''),
  content_en: text('content_en').default(''),
  excerpt_ar: text('excerpt_ar').default(''),
  excerpt_en: text('excerpt_en').default(''),
  cover_image: text('cover_image'),
  cover_image_id: uuid('cover_image_id').references(() => media.id),
  status: text('status').default('draft').notNull(),
  status_ar: text('status_ar').default('draft').notNull(),
  status_en: text('status_en').default('draft').notNull(),
  is_featured: boolean('is_featured').default(false),
  published_at: timestamp('published_at', { withTimezone: true }),
  published_at_ar: timestamp('published_at_ar', { withTimezone: true }),
  published_at_en: timestamp('published_at_en', { withTimezone: true }),
  seo_title_ar: text('seo_title_ar'),
  seo_description_ar: text('seo_description_ar'),
  seo_title_en: text('seo_title_en'),
  seo_description_en: text('seo_description_en'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
