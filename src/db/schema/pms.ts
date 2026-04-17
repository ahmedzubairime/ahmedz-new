import { accounts } from "./core";
import { media, mediaFolders } from "./media";
import { pgTable, index, foreignKey, pgPolicy, check, uuid, text, bigint, integer, timestamp, unique, boolean, jsonb, doublePrecision, numeric, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { branches } from "./store";







export const pmsProjects = pgTable("pms_projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	slug: text().notNull(),
	status: text().default('planning').notNull(),
	priority: text().default('medium').notNull(),
	color: text().default('#3b82f6'),
	startDate: date("start_date"),
	dueDate: date("due_date"),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	branchId: uuid("branch_id"),
	createdBy: uuid("created_by"),
	budget: numeric({ precision: 12, scale:  2 }),
	currency: text().default('SAR'),
	isArchived: boolean("is_archived").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_pms_projects_branch").using("btree", table.branchId.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_projects_created_by").using("btree", table.createdBy.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_projects_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.branchId],
			foreignColumns: [branches.id],
			name: "pms_projects_branch_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [accounts.id],
			name: "pms_projects_created_by_fkey"
		}).onDelete("set null"),
	unique("pms_projects_slug_key").on(table.slug),
	pgPolicy("pms_projects_manage", { as: "permissive", for: "all", to: ["public"], using: sql`user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text])` }),
	pgPolicy("pms_projects_read", { as: "permissive", for: "select", to: ["public"] }),
	check("pms_projects_priority_check", sql`priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])`),
	check("pms_projects_status_check", sql`status = ANY (ARRAY['planning'::text, 'active'::text, 'on_hold'::text, 'completed'::text, 'archived'::text])`),
]);

export const pmsProjectMembers = pgTable("pms_project_members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	accountId: uuid("account_id").notNull(),
	projectRole: text("project_role").default('member').notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_pms_project_members_account").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_project_members_project").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "pms_project_members_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [pmsProjects.id],
			name: "pms_project_members_project_id_fkey"
		}).onDelete("cascade"),
	unique("pms_project_members_project_id_account_id_key").on(table.projectId, table.accountId),
	pgPolicy("pms_members_manage", { as: "permissive", for: "all", to: ["public"], using: sql`user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text])` }),
	pgPolicy("pms_members_read", { as: "permissive", for: "select", to: ["public"] }),
	check("pms_project_members_project_role_check", sql`project_role = ANY (ARRAY['owner'::text, 'manager'::text, 'member'::text, 'viewer'::text])`),
]);

export const pmsTaskStatuses = pgTable("pms_task_statuses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	color: text().default('#3b82f6'),
	icon: text().default('circle'),
	sortOrder: integer("sort_order").default(0),
	isDefault: boolean("is_default").default(false),
	isFinal: boolean("is_final").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("pms_statuses_manage", { as: "permissive", for: "all", to: ["public"], using: sql`user_has_role(ARRAY['super-admin'::text, 'admin'::text])` }),
	pgPolicy("pms_statuses_read", { as: "permissive", for: "select", to: ["public"] }),
]);

export const pmsLabels = pgTable("pms_labels", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	color: text().default('#6366f1'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("pms_labels_manage", { as: "permissive", for: "all", to: ["public"], using: sql`user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'team-leader'::text])` }),
	pgPolicy("pms_labels_read", { as: "permissive", for: "select", to: ["public"] }),
]);

export const pmsTasks = pgTable("pms_tasks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	statusId: uuid("status_id"),
	priority: text().default('medium').notNull(),
	assigneeId: uuid("assignee_id"),
	reporterId: uuid("reporter_id"),
	parentTaskId: uuid("parent_task_id"),
	dueDate: date("due_date"),
	startDate: date("start_date"),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	estimatedHours: numeric("estimated_hours", { precision: 6, scale:  2 }),
	loggedHours: numeric("logged_hours", { precision: 6, scale:  2 }).default('0'),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_pms_tasks_assignee").using("btree", table.assigneeId.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_tasks_parent").using("btree", table.parentTaskId.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_tasks_priority").using("btree", table.priority.asc().nullsLast().op("text_ops")),
	index("idx_pms_tasks_project").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_tasks_status").using("btree", table.statusId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assigneeId],
			foreignColumns: [accounts.id],
			name: "pms_tasks_assignee_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.parentTaskId],
			foreignColumns: [table.id],
			name: "pms_tasks_parent_task_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [pmsProjects.id],
			name: "pms_tasks_project_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.reporterId],
			foreignColumns: [accounts.id],
			name: "pms_tasks_reporter_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.statusId],
			foreignColumns: [pmsTaskStatuses.id],
			name: "pms_tasks_status_id_fkey"
		}).onDelete("set null"),
	pgPolicy("pms_tasks_manage", { as: "permissive", for: "all", to: ["public"], using: sql`(user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text]) OR (assignee_id = auth.uid()))` }),
	pgPolicy("pms_tasks_read", { as: "permissive", for: "select", to: ["public"] }),
	check("pms_tasks_priority_check", sql`priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])`),
]);

export const pmsTaskComments = pgTable("pms_task_comments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	taskId: uuid("task_id").notNull(),
	authorId: uuid("author_id").notNull(),
	contentText: text("content_text").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_pms_task_comments_task").using("btree", table.taskId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [accounts.id],
			name: "pms_task_comments_author_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [pmsTasks.id],
			name: "pms_task_comments_task_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("pms_comments_manage", { as: "permissive", for: "all", to: ["public"], using: sql`((author_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text]))` }),
	pgPolicy("pms_comments_read", { as: "permissive", for: "select", to: ["public"] }),
]);

export const pmsTaskAttachments = pgTable("pms_task_attachments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	taskId: uuid("task_id").notNull(),
	uploaderId: uuid("uploader_id").notNull(),
	mediaId: uuid("media_id"),
	fileName: text("file_name").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSize: bigint("file_size", { mode: "number" }),
	fileUrl: text("file_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.mediaId],
			foreignColumns: [media.id],
			name: "pms_task_attachments_media_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [pmsTasks.id],
			name: "pms_task_attachments_task_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.uploaderId],
			foreignColumns: [accounts.id],
			name: "pms_task_attachments_uploader_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("pms_attachments_manage", { as: "permissive", for: "all", to: ["public"], using: sql`((uploader_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text]))` }),
	pgPolicy("pms_attachments_read", { as: "permissive", for: "select", to: ["public"] }),
]);

export const pmsTimeEntries = pgTable("pms_time_entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	taskId: uuid("task_id").notNull(),
	accountId: uuid("account_id").notNull(),
	startTime: timestamp("start_time", { withTimezone: true, mode: 'string' }),
	endTime: timestamp("end_time", { withTimezone: true, mode: 'string' }),
	durationMinutes: integer("duration_minutes").default(0).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_pms_time_entries_account").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_time_entries_task").using("btree", table.taskId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "pms_time_entries_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [pmsTasks.id],
			name: "pms_time_entries_task_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("pms_time_manage", { as: "permissive", for: "all", to: ["public"], using: sql`((account_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'team-leader'::text]))` }),
	pgPolicy("pms_time_read", { as: "permissive", for: "select", to: ["public"] }),
]);

export const pmsTeams = pgTable("pms_teams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	color: text().default('#3b82f6'),
	creatorId: uuid("creator_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_pms_teams_creator").using("btree", table.creatorId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.creatorId],
			foreignColumns: [accounts.id],
			name: "pms_teams_creator_id_fkey"
		}).onDelete("set null"),
	pgPolicy("pms_teams_manage", { as: "permissive", for: "all", to: ["public"], using: sql`user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text])` }),
	pgPolicy("pms_teams_read", { as: "permissive", for: "select", to: ["public"] }),
]);

export const pmsActivityLogs = pgTable("pms_activity_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	accountId: uuid("account_id"),
	actionType: text("action_type").notNull(),
	entityType: text("entity_type").notNull(),
	entityId: uuid("entity_id").notNull(),
	projectId: uuid("project_id"),
	taskId: uuid("task_id"),
	details: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_pms_activity_logs_account").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_activity_logs_created").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_pms_activity_logs_project").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_activity_logs_task").using("btree", table.taskId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "pms_activity_logs_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [pmsProjects.id],
			name: "pms_activity_logs_project_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [pmsTasks.id],
			name: "pms_activity_logs_task_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("pms_logs_insert", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`((account_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text]))`  }),
	pgPolicy("pms_logs_manage", { as: "permissive", for: "all", to: ["public"] }),
	pgPolicy("pms_logs_read", { as: "permissive", for: "select", to: ["public"] }),
]);

export const pmsTaskLabels = pgTable("pms_task_labels", {
	taskId: uuid("task_id").notNull(),
	labelId: uuid("label_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.labelId],
			foreignColumns: [pmsLabels.id],
			name: "pms_task_labels_label_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [pmsTasks.id],
			name: "pms_task_labels_task_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.taskId, table.labelId], name: "pms_task_labels_pkey"}),
	pgPolicy("pms_task_labels_manage", { as: "permissive", for: "all", to: ["public"], using: sql`user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text])` }),
	pgPolicy("pms_task_labels_read", { as: "permissive", for: "select", to: ["public"] }),
]);

export const pmsProjectTeams = pgTable("pms_project_teams", {
	projectId: uuid("project_id").notNull(),
	teamId: uuid("team_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_pms_project_teams_project").using("btree", table.projectId.asc().nullsLast().op("uuid_ops")),
	index("idx_pms_project_teams_team").using("btree", table.teamId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [pmsProjects.id],
			name: "pms_project_teams_project_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [pmsTeams.id],
			name: "pms_project_teams_team_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.projectId, table.teamId], name: "pms_project_teams_pkey"}),
	pgPolicy("pms_project_teams_manage", { as: "permissive", for: "all", to: ["public"], using: sql`user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text])` }),
	pgPolicy("pms_project_teams_read", { as: "permissive", for: "select", to: ["public"] }),
]);

export const pmsTeamMembers = pgTable("pms_team_members", {
	teamId: uuid("team_id").notNull(),
	accountId: uuid("account_id").notNull(),
	role: text().default('member').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_pms_team_members_account").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "pms_team_members_account_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [pmsTeams.id],
			name: "pms_team_members_team_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.teamId, table.accountId], name: "pms_team_members_pkey"}),
	pgPolicy("pms_team_members_manage", { as: "permissive", for: "all", to: ["public"], using: sql`user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text])` }),
	pgPolicy("pms_team_members_read", { as: "permissive", for: "select", to: ["public"] }),
	check("pms_team_members_role_check", sql`role = ANY (ARRAY['owner'::text, 'manager'::text, 'member'::text])`),
]);
