import { users } from "./auth";
import { pgTable, index, foreignKey, pgPolicy, check, uuid, text, bigint, integer, timestamp, unique, boolean, jsonb, doublePrecision, numeric, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { pages } from "./cms";





export const accounts = pgTable("accounts", {
	id: uuid().primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	avatarUrl: text("avatar_url"),
	phone: text(),
	status: text().default('pending_setup').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_accounts_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "accounts_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Admins can read all accounts", { as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM (account_roles ar
     JOIN roles r ON ((r.id = ar.role_id)))
  WHERE ((ar.account_id = auth.uid()) AND (ar.role_id = ANY (ARRAY['super-admin'::text, 'admin'::text])))))` }),
	pgPolicy("Users can insert own account", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can read own account", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Users can update own account", { as: "permissive", for: "update", to: ["public"] }),
	check("accounts_status_check", sql`status = ANY (ARRAY['pending_setup'::text, 'active'::text, 'suspended'::text])`),
]);

export const roles = pgTable("roles", {
	id: text().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	isSystem: boolean("is_system").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Authenticated can read roles", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Super-admins can manage roles", { as: "permissive", for: "all", to: ["public"] }),
	check("roles_id_check", sql`id ~ '^[a-z0-9-]+$'::text`),
]);

export const auditLogs = pgTable("audit_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	actorId: uuid("actor_id"),
	action: text().notNull(),
	entityType: text("entity_type"),
	entityId: text("entity_id"),
	details: jsonb().default({}),
	ipAddress: text("ip_address"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_audit_logs_actor").using("btree", table.actorId.asc().nullsLast().op("uuid_ops")),
	index("idx_audit_logs_created_at").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.actorId],
			foreignColumns: [users.id],
			name: "audit_logs_actor_id_fkey"
		}),
	pgPolicy("Admins can read logs", { as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM account_roles ar
  WHERE ((ar.account_id = auth.uid()) AND (ar.role_id = ANY (ARRAY['super-admin'::text, 'admin'::text])))))` }),
]);

export const accountRoles = pgTable("account_roles", {
	accountId: uuid("account_id").notNull(),
	roleId: text("role_id").notNull(),
	assignedAt: timestamp("assigned_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_account_roles_role").using("btree", table.roleId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "account_roles_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "account_roles_role_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.accountId, table.roleId], name: "account_roles_pkey"}),
	pgPolicy("Admins can read all account roles", { as: "permissive", for: "select", to: ["public"], using: sql`((account_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text]))` }),
	pgPolicy("Super-admins can manage account roles", { as: "permissive", for: "all", to: ["public"] }),
	pgPolicy("Users can read own roles", { as: "permissive", for: "select", to: ["public"] }),
]);

export const rolePagePermissions = pgTable("role_page_permissions", {
	roleId: text("role_id").notNull(),
	pageId: text("page_id").notNull(),
	canCreate: boolean("can_create").default(false).notNull(),
	canRead: boolean("can_read").default(false).notNull(),
	canUpdate: boolean("can_update").default(false).notNull(),
	canDelete: boolean("can_delete").default(false).notNull(),
}, (table) => [
	index("idx_rpp_page").using("btree", table.pageId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.pageId],
			foreignColumns: [pages.id],
			name: "role_page_permissions_page_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_page_permissions_role_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.roleId, table.pageId], name: "role_page_permissions_pkey"}),
	pgPolicy("Authenticated can read permissions", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Super-admins can manage permissions", { as: "permissive", for: "all", to: ["public"] }),
]);
