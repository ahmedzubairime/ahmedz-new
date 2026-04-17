import { users } from "./auth";
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const newsletterMembers = pgTable('newsletter_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  status: text('status').default('active').notNull(),
  subscribed_at: timestamp('subscribed_at', { withTimezone: true }).defaultNow(),
  unsubscribed_at: timestamp('unsubscribed_at', { withTimezone: true }),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  preferred_locale: text('preferred_locale').default('ar').notNull(),
  status: text('status').default('active').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  unsubscribed_at: timestamp('unsubscribed_at', { withTimezone: true }),
});

export const newsletterCampaigns = pgTable('newsletter_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  subject_ar: text('subject_ar'),
  subject_en: text('subject_en'),
  body_html_ar: text('body_html_ar'),
  body_html_en: text('body_html_en'),
  target_locale: text('target_locale').default('both').notNull(),
  status: text('status').default('drafting').notNull(),
  sent_at: timestamp('sent_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  created_by: uuid('created_by').references(() => users.id),
});
