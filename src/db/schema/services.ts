import { pgTable, uuid, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { media } from './media';

export const servicesCategories = pgTable('services_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name_ar: text('name_ar').notNull(),
  name_en: text('name_en').notNull(),
  description_ar: text('description_ar'),
  description_en: text('description_en'),
  sort_order: integer('sort_order').default(0),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  category_id: uuid('category_id').references(() => servicesCategories.id),
  slug: text('slug').notNull().unique(),
  title_ar: text('title_ar').notNull(),
  title_en: text('title_en').notNull(),
  description_ar: text('description_ar'),
  description_en: text('description_en'),
  image_id: uuid('image_id').references(() => media.id),
  sort_order: integer('sort_order').default(0),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
