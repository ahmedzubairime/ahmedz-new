import { pgTable, uuid, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { media } from './media';

export const homepageHero = pgTable('homepage_hero', {
  id: integer('id').primaryKey().default(1),
  title_ar: text('title_ar').default('').notNull(),
  title_en: text('title_en').default('').notNull(),
  subtitle_ar: text('subtitle_ar'),
  subtitle_en: text('subtitle_en'),
  cta_primary_text_ar: text('cta_primary_text_ar'),
  cta_primary_text_en: text('cta_primary_text_en'),
  cta_primary_link: text('cta_primary_link'),
  image_id: uuid('image_id').references(() => media.id),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const homepageFeatures = pgTable('homepage_features', {
  id: uuid('id').primaryKey().defaultRandom(),
  title_ar: text('title_ar').notNull(),
  title_en: text('title_en').notNull(),
  description_ar: text('description_ar'),
  description_en: text('description_en'),
  icon_name: text('icon_name'),
  sort_order: integer('sort_order').default(0),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const homepagePartners = pgTable('homepage_partners', {
  id: uuid('id').primaryKey().defaultRandom(),
  name_ar: text('name_ar'),
  name_en: text('name_en'),
  website_url: text('website_url'),
  logo_id: uuid('logo_id').references(() => media.id),
  sort_order: integer('sort_order').default(0),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const homepageTestimonials = pgTable('homepage_testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  author_name_ar: text('author_name_ar').notNull(),
  author_name_en: text('author_name_en').notNull(),
  role_ar: text('role_ar'),
  role_en: text('role_en'),
  content_ar: text('content_ar').notNull(),
  content_en: text('content_en').notNull(),
  avatar_id: uuid('avatar_id').references(() => media.id),
  sort_order: integer('sort_order').default(0),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
