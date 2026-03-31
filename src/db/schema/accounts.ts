import { pgTable, uuid, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().references(() => users.id),
  full_name: text('full_name').notNull(),
  avatar_url: text('avatar_url'),
  phone: text('phone'),
  status: text('status').default('pending_setup').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const roles = pgTable('roles', {
  id: text('id').primaryKey(),
  name_ar: text('name_ar').notNull(),
  name_en: text('name_en').notNull(),
  description_ar: text('description_ar'),
  description_en: text('description_en'),
  is_system: boolean('is_system').default(false).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const accountRoles = pgTable('account_roles', {
  account_id: uuid('account_id').notNull().references(() => accounts.id),
  role_id: text('role_id').notNull().references(() => roles.id),
  assigned_at: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actor_id: uuid('actor_id').references(() => users.id),
  action: text('action').notNull(),
  entity_type: text('entity_type'),
  entity_id: text('entity_id'),
  details: jsonb('details').default({}),
  ip_address: text('ip_address'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
