import { pgTable, text, timestamp, integer, boolean, uuid, AnyPgColumn } from 'drizzle-orm/pg-core';
import { roles } from './accounts';

export const sections = pgTable('sections', {
  id: text('id').primaryKey(),
  name_ar: text('name_ar').notNull(),
  name_en: text('name_en').notNull(),
  path: text('path').notNull(),
  icon: text('icon'),
  sort_order: integer('sort_order').default(0).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const pageGroups = pgTable('page_groups', {
  id: text('id').primaryKey(),
  section_id: text('section_id').notNull().references(() => sections.id),
  name_ar: text('name_ar').notNull(),
  name_en: text('name_en').notNull(),
  icon: text('icon'),
  sort_order: integer('sort_order').default(0).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const pages = pgTable('pages', {
  id: text('id').primaryKey(),
  group_id: text('group_id').notNull().references(() => pageGroups.id),
  section_id: text('section_id').notNull().references(() => sections.id),
  parent_id: text('parent_id').references((): AnyPgColumn => pages.id), // Recursive self-reference
  name_ar: text('name_ar').notNull(),
  name_en: text('name_en').notNull(),
  path: text('path').notNull(),
  icon: text('icon'),
  sort_order: integer('sort_order').default(0).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const rolePagePermissions = pgTable('role_page_permissions', {
  role_id: text('role_id').notNull().references(() => roles.id),
  page_id: text('page_id').notNull().references(() => pages.id),
  can_create: boolean('can_create').default(false).notNull(),
  can_read: boolean('can_read').default(false).notNull(),
  can_update: boolean('can_update').default(false).notNull(),
  can_delete: boolean('can_delete').default(false).notNull(),
});

export const cmsPages = pgTable('cms_pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title_ar: text('title_ar').notNull().default(''),
  title_en: text('title_en').notNull().default(''),
  content_ar: text('content_ar').default(''),
  content_en: text('content_en').default(''),
  meta_title_ar: text('meta_title_ar').default(''),
  meta_title_en: text('meta_title_en').default(''),
  meta_description_ar: text('meta_description_ar').default(''),
  meta_description_en: text('meta_description_en').default(''),
  status: text('status').default('draft').notNull(),
  sort_order: integer('sort_order').default(0),
  published_at: timestamp('published_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
