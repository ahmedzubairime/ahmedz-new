import { pgTable, uuid, text, timestamp, integer, boolean, doublePrecision } from 'drizzle-orm/pg-core';

export const contactInfo = pgTable('contact_info', {
  id: integer('id').primaryKey().default(1),
  email_primary: text('email_primary'),
  email_support: text('email_support'),
  phone_primary: text('phone_primary'),
  phone_secondary: text('phone_secondary'),
  address_ar: text('address_ar'),
  address_en: text('address_en'),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const socialLinks = pgTable('social_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  platform: text('platform').notNull(),
  url: text('url').notNull(),
  sort_order: integer('sort_order').default(0),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const branches = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  name_ar: text('name_ar').notNull(),
  name_en: text('name_en').notNull(),
  address_ar: text('address_ar').notNull(),
  address_en: text('address_en').notNull(),
  phone: text('phone'),
  email: text('email'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  sort_order: integer('sort_order').default(0),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
