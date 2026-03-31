import { pgSchema, text, uuid, timestamp, boolean, bigint, jsonb, integer, varchar } from 'drizzle-orm/pg-core';

export const storageSchema = pgSchema('storage');

export const bucketTypeEnum = storageSchema.enum('buckettype', ['STANDARD', 'ANALYTICS', 'VECTOR']);

export const buckets = storageSchema.table('buckets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  owner: uuid('owner'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  public: boolean('public').default(false),
  avif_autodetection: boolean('avif_autodetection').default(false),
  file_size_limit: bigint('file_size_limit', { mode: 'number' }),
  allowed_mime_types: text('allowed_mime_types').array(),
  owner_id: text('owner_id'),
  type: bucketTypeEnum('type').default('STANDARD'),
});

export const objects = storageSchema.table('objects', {
  id: uuid('id').primaryKey().defaultRandom(),
  bucket_id: text('bucket_id').references(() => buckets.id),
  name: text('name'),
  owner: uuid('owner'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  last_accessed_at: timestamp('last_accessed_at', { withTimezone: true }).defaultNow(),
  metadata: jsonb('metadata'),
  path_tokens: text('path_tokens').array(),
  version: text('version'),
  owner_id: text('owner_id'),
  user_metadata: jsonb('user_metadata'),
});

export const s3MultipartUploads = storageSchema.table('s3_multipart_uploads', {
  id: text('id').primaryKey(),
  in_progress_size: bigint('in_progress_size', { mode: 'number' }).default(0).notNull(),
  upload_signature: text('upload_signature').notNull(),
  bucket_id: text('bucket_id').notNull().references(() => buckets.id),
  key: text('key').notNull(),
  version: text('version').notNull(),
  owner_id: text('owner_id'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  user_metadata: jsonb('user_metadata'),
});

export const s3MultipartUploadsParts = storageSchema.table('s3_multipart_uploads_parts', {
  id: uuid('id').primaryKey().defaultRandom(),
  upload_id: text('upload_id').notNull().references(() => s3MultipartUploads.id),
  size: bigint('size', { mode: 'number' }).default(0).notNull(),
  part_number: integer('part_number').notNull(),
  bucket_id: text('bucket_id').notNull().references(() => buckets.id),
  key: text('key').notNull(),
  etag: text('etag').notNull(),
  owner_id: text('owner_id'),
  version: text('version').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const migrations = storageSchema.table('migrations', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  hash: varchar('hash', { length: 255 }).notNull(),
  executed_at: timestamp('executed_at'),
});
