import { accounts } from "./core";
import { pgTable, index, foreignKey, pgPolicy, check, uuid, text, bigint, integer, timestamp, unique, boolean, jsonb, doublePrecision, numeric, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const media = pgTable("media", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	folderId: uuid("folder_id"),
	bucket: text().notNull(),
	storagePath: text("storage_path").notNull(),
	filename: text().notNull(),
	originalName: text("original_name").notNull(),
	mimeType: text("mime_type").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sizeBytes: bigint("size_bytes", { mode: "number" }).default(0).notNull(),
	width: integer(),
	height: integer(),
	altAr: text("alt_ar").default(''),
	altEn: text("alt_en").default(''),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_media_bucket").using("btree", table.bucket.asc().nullsLast().op("text_ops")),
	index("idx_media_created").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_media_folder").using("btree", table.folderId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [accounts.id],
			name: "media_created_by_fkey"
		}),
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [mediaFolders.id],
			name: "media_folder_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Authenticated users can read media", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Content editors can manage media", { as: "permissive", for: "all", to: ["public"] }),
	check("media_bucket_check", sql`bucket = ANY (ARRAY['images'::text, 'videos'::text, 'documents'::text])`),
]);




export const mediaFolders = pgTable("media_folders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	parentId: uuid("parent_id"),
	name: text().notNull(),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [accounts.id],
			name: "media_folders_created_by_fkey"
		}),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "media_folders_parent_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Authenticated users can read folders", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Content editors can manage folders", { as: "permissive", for: "all", to: ["public"] }),
]);
