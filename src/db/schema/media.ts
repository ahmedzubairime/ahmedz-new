import { pgTable, uuid, text, timestamp, bigint, integer, AnyPgColumn } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const mediaFolders = pgTable('media_folders', {
  id: uuid('id').primaryKey().defaultRandom(),
  parent_id: uuid('parent_id').references((): AnyPgColumn => mediaFolders.id),
  name: text('name').notNull(),
  created_by: uuid('created_by').references(() => accounts.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  folder_id: uuid('folder_id').references(() => mediaFolders.id),
  bucket: text('bucket').notNull(),
  storage_path: text('storage_path').notNull(),
  filename: text('filename').notNull(),
  original_name: text('original_name').notNull(),
  mime_type: text('mime_type').notNull(),
  size_bytes: bigint('size_bytes', { mode: 'number' }).default(0).notNull(),
  width: integer('width'),
  height: integer('height'),
  alt_ar: text('alt_ar').default(''),
  alt_en: text('alt_en').default(''),
  created_by: uuid('created_by').references(() => accounts.id),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
