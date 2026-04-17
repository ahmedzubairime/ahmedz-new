export const users = pgTable("users", { id: uuid("id").primaryKey() });
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

export const newsletterMembers = pgTable("newsletter_members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	status: text().default('active').notNull(),
	subscribedAt: timestamp("subscribed_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_newsletter_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_newsletter_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	unique("newsletter_members_email_key").on(table.email),
	pgPolicy("Admins can manage newsletter", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	check("newsletter_members_status_check", sql`status = ANY (ARRAY['active'::text, 'unsubscribed'::text])`),
]);

export const cmsPages = pgTable("cms_pages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	titleAr: text("title_ar").default('').notNull(),
	titleEn: text("title_en").default('').notNull(),
	contentAr: text("content_ar").default(''),
	contentEn: text("content_en").default(''),
	metaTitleAr: text("meta_title_ar").default(''),
	metaTitleEn: text("meta_title_en").default(''),
	metaDescriptionAr: text("meta_description_ar").default(''),
	metaDescriptionEn: text("meta_description_en").default(''),
	status: text().default('draft').notNull(),
	sortOrder: integer("sort_order").default(0),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("cms_pages_slug_key").on(table.slug),
	pgPolicy("Content editors can manage pages", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Published pages are public", { as: "permissive", for: "select", to: ["public"] }),
	check("cms_pages_status_check", sql`status = ANY (ARRAY['draft'::text, 'published'::text])`),
]);

export const newsletterCampaigns = pgTable("newsletter_campaigns", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	subjectAr: text("subject_ar"),
	subjectEn: text("subject_en"),
	bodyHtmlAr: text("body_html_ar"),
	bodyHtmlEn: text("body_html_en"),
	targetLocale: text("target_locale").default('both').notNull(),
	status: text().default('drafting').notNull(),
	sentAt: timestamp("sent_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	createdBy: uuid("created_by"),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "newsletter_campaigns_created_by_fkey"
		}).onDelete("set null"),
	pgPolicy("Content editors can manage campaigns", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	check("newsletter_campaigns_status_check", sql`status = ANY (ARRAY['drafting'::text, 'sending'::text, 'sent'::text])`),
	check("newsletter_campaigns_target_locale_check", sql`target_locale = ANY (ARRAY['both'::text, 'ar'::text, 'en'::text])`),
]);

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

export const sections = pgTable("sections", {
	id: text().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	path: text().notNull(),
	icon: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Authenticated can read sections", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Super-admins can manage sections", { as: "permissive", for: "all", to: ["public"] }),
	check("sections_id_check", sql`id ~ '^[a-z0-9-]+$'::text`),
]);

export const pageGroups = pgTable("page_groups", {
	id: text().primaryKey().notNull(),
	sectionId: text("section_id").notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	icon: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_page_groups_section").using("btree", table.sectionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.sectionId],
			foreignColumns: [sections.id],
			name: "page_groups_section_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Authenticated can read page_groups", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Super-admins can manage page_groups", { as: "permissive", for: "all", to: ["public"] }),
	check("page_groups_id_check", sql`id ~ '^[a-z0-9.-]+$'::text`),
]);

export const pages = pgTable("pages", {
	id: text().primaryKey().notNull(),
	groupId: text("group_id").notNull(),
	sectionId: text("section_id").notNull(),
	parentId: text("parent_id"),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	path: text().notNull(),
	icon: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_pages_group").using("btree", table.groupId.asc().nullsLast().op("text_ops")),
	index("idx_pages_parent").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	index("idx_pages_section").using("btree", table.sectionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [pageGroups.id],
			name: "pages_group_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "pages_parent_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sectionId],
			foreignColumns: [sections.id],
			name: "pages_section_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Authenticated can read pages", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Super-admins can manage pages", { as: "permissive", for: "all", to: ["public"] }),
	check("pages_id_check", sql`id ~ '^[a-z0-9.-]+$'::text`),
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

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	preferredLocale: text("preferred_locale").default('ar').notNull(),
	status: text().default('active').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("newsletter_subscribers_email_key").on(table.email),
	pgPolicy("Content editors can manage subscribers", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	check("newsletter_subscribers_locale_check", sql`preferred_locale = ANY (ARRAY['ar'::text, 'en'::text])`),
	check("newsletter_subscribers_status_check", sql`status = ANY (ARRAY['active'::text, 'unsubscribed'::text])`),
]);

export const postCategories = pgTable("post_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	slug: text().notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("post_categories_slug_key").on(table.slug),
	pgPolicy("Admins can manage categories", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Authenticated users can read categories", { as: "permissive", for: "select", to: ["authenticated"] }),
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

export const posts = pgTable("posts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	categoryId: uuid("category_id"),
	authorId: uuid("author_id").notNull(),
	titleAr: text("title_ar").default('').notNull(),
	titleEn: text("title_en").default('').notNull(),
	slug: text().notNull(),
	contentAr: text("content_ar").default(''),
	contentEn: text("content_en").default(''),
	excerptAr: text("excerpt_ar").default(''),
	excerptEn: text("excerpt_en").default(''),
	coverImage: text("cover_image"),
	status: text().default('draft').notNull(),
	isFeatured: boolean("is_featured").default(false),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	slugAr: text("slug_ar"),
	slugEn: text("slug_en"),
	coverImageId: uuid("cover_image_id"),
	statusAr: text("status_ar").default('draft').notNull(),
	statusEn: text("status_en").default('draft').notNull(),
	publishedAtAr: timestamp("published_at_ar", { withTimezone: true, mode: 'string' }),
	publishedAtEn: timestamp("published_at_en", { withTimezone: true, mode: 'string' }),
	seoTitleAr: text("seo_title_ar"),
	seoDescriptionAr: text("seo_description_ar"),
	seoTitleEn: text("seo_title_en"),
	seoDescriptionEn: text("seo_description_en"),
}, (table) => [
	index("idx_posts_category").using("btree", table.categoryId.asc().nullsLast().op("uuid_ops")),
	index("idx_posts_published").using("btree", table.publishedAt.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_posts_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("idx_posts_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [accounts.id],
			name: "posts_author_id_fkey"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [postCategories.id],
			name: "posts_category_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.coverImageId],
			foreignColumns: [media.id],
			name: "posts_cover_image_id_fkey"
		}).onDelete("set null"),
	unique("posts_slug_key").on(table.slug),
	pgPolicy("Content editors can manage posts", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Published posts are public", { as: "permissive", for: "select", to: ["public"] }),
	check("posts_status_ar_check", sql`status_ar = ANY (ARRAY['draft'::text, 'scheduled'::text, 'published'::text])`),
	check("posts_status_check", sql`status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])`),
	check("posts_status_en_check", sql`status_en = ANY (ARRAY['draft'::text, 'scheduled'::text, 'published'::text])`),
]);

export const homepagePartners = pgTable("homepage_partners", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar"),
	nameEn: text("name_en"),
	websiteUrl: text("website_url"),
	logoId: uuid("logo_id"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.logoId],
			foreignColumns: [media.id],
			name: "homepage_partners_logo_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Editors can manage homepage_partners", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read access for homepage_partners", { as: "permissive", for: "select", to: ["public"] }),
]);

export const services = pgTable("services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	categoryId: uuid("category_id"),
	slug: text().notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	imageId: uuid("image_id"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	iconName: text("icon_name").default('briefcase'),
	longDescriptionAr: text("long_description_ar"),
	longDescriptionEn: text("long_description_en"),
	featuresAr: text("features_ar").array().default([""]),
	featuresEn: text("features_en").array().default([""]),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [servicesCategories.id],
			name: "services_category_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "services_image_id_fkey"
		}).onDelete("set null"),
	unique("services_slug_key").on(table.slug),
	pgPolicy("Editors can manage services", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read access for services", { as: "permissive", for: "select", to: ["public"] }),
]);

export const contactInfo = pgTable("contact_info", {
	id: integer().default(1).primaryKey().notNull(),
	emailPrimary: text("email_primary"),
	emailSupport: text("email_support"),
	phonePrimary: text("phone_primary"),
	phoneSecondary: text("phone_secondary"),
	addressAr: text("address_ar"),
	addressEn: text("address_en"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Editors can manage contact_info", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read access for contact_info", { as: "permissive", for: "select", to: ["public"] }),
	check("contact_info_single_row", sql`id = 1`),
]);

export const socialLinks = pgTable("social_links", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	platform: text().notNull(),
	url: text().notNull(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Editors can manage social_links", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read access for social_links", { as: "permissive", for: "select", to: ["public"] }),
]);

export const branches = pgTable("branches", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	addressAr: text("address_ar").notNull(),
	addressEn: text("address_en").notNull(),
	phone: text(),
	email: text(),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Editors can manage branches", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read access for branches", { as: "permissive", for: "select", to: ["public"] }),
]);

export const servicesCategories = pgTable("services_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	imageId: uuid("image_id"),
	isActive: boolean("is_active").default(true),
	parentId: uuid("parent_id"),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "services_categories_image_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "services_categories_parent_id_fkey"
		}).onDelete("set null"),
	unique("services_categories_slug_key").on(table.slug),
	pgPolicy("Editors can manage services_categories", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read access for services_categories", { as: "permissive", for: "select", to: ["public"] }),
]);

export const homepageHero = pgTable("homepage_hero", {
	id: integer().default(1).primaryKey().notNull(),
	titleAr: text("title_ar").default('').notNull(),
	titleEn: text("title_en").default('').notNull(),
	subtitleAr: text("subtitle_ar"),
	subtitleEn: text("subtitle_en"),
	ctaPrimaryTextAr: text("cta_primary_text_ar"),
	ctaPrimaryTextEn: text("cta_primary_text_en"),
	ctaPrimaryLink: text("cta_primary_link"),
	imageId: uuid("image_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	ctaSecondaryTextAr: text("cta_secondary_text_ar"),
	ctaSecondaryTextEn: text("cta_secondary_text_en"),
	ctaSecondaryLink: text("cta_secondary_link"),
	badgeTextAr: text("badge_text_ar"),
	badgeTextEn: text("badge_text_en"),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "homepage_hero_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Editors can manage homepage_hero", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read access for homepage_hero", { as: "permissive", for: "select", to: ["public"] }),
	check("homepage_hero_single_row", sql`id = 1`),
]);

export const homepageFeatures = pgTable("homepage_features", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	iconName: text("icon_name"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	imageId: uuid("image_id"),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "homepage_features_image_id_fkey"
		}),
	pgPolicy("Editors can manage homepage_features", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read access for homepage_features", { as: "permissive", for: "select", to: ["public"] }),
]);

export const homepageTestimonials = pgTable("homepage_testimonials", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	authorNameAr: text("author_name_ar").notNull(),
	authorNameEn: text("author_name_en").notNull(),
	roleAr: text("role_ar"),
	roleEn: text("role_en"),
	contentAr: text("content_ar").notNull(),
	contentEn: text("content_en").notNull(),
	avatarId: uuid("avatar_id"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	rating: integer().default(5),
}, (table) => [
	foreignKey({
			columns: [table.avatarId],
			foreignColumns: [media.id],
			name: "homepage_testimonials_avatar_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Editors can manage homepage_testimonials", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read access for homepage_testimonials", { as: "permissive", for: "select", to: ["public"] }),
	check("homepage_testimonials_rating_check", sql`(rating >= 1) AND (rating <= 5)`),
]);

export const storeCategories = pgTable("store_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	parentId: uuid("parent_id"),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	slug: text().notNull(),
	descriptionAr: text("description_ar").default(''),
	descriptionEn: text("description_en").default(''),
	icon: text(),
	imageId: uuid("image_id"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "store_categories_image_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "store_categories_parent_id_fkey"
		}).onDelete("set null"),
	unique("store_categories_slug_key").on(table.slug),
	pgPolicy("Editors can manage store_categories", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read store_categories", { as: "permissive", for: "select", to: ["public"] }),
]);

export const storeProducts = pgTable("store_products", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	categoryId: uuid("category_id"),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	slug: text().notNull(),
	descriptionAr: text("description_ar").default(''),
	descriptionEn: text("description_en").default(''),
	basePrice: numeric("base_price", { precision: 10, scale:  2 }).default('0').notNull(),
	salePrice: numeric("sale_price", { precision: 10, scale:  2 }),
	sku: text(),
	barcode: text(),
	stockQuantity: integer("stock_quantity").default(0),
	coverImageId: uuid("cover_image_id"),
	galleryImages: uuid("gallery_images").array().default([""]),
	isActive: boolean("is_active").default(true),
	isDeleted: boolean("is_deleted").default(false),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [storeCategories.id],
			name: "store_products_category_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.coverImageId],
			foreignColumns: [media.id],
			name: "store_products_cover_image_id_fkey"
		}).onDelete("set null"),
	unique("store_products_slug_key").on(table.slug),
	pgPolicy("Editors can manage store_products", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read store_products", { as: "permissive", for: "select", to: ["public"] }),
]);

export const storeProductVariants = pgTable("store_product_variants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	productId: uuid("product_id").notNull(),
	sku: text().notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	salePrice: numeric("sale_price", { precision: 10, scale:  2 }),
	stockQuantity: integer("stock_quantity").default(0),
	attributes: jsonb().default({}).notNull(),
	imageId: uuid("image_id"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "store_product_variants_image_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [storeProducts.id],
			name: "store_product_variants_product_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Editors can manage store_product_variants", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read store_product_variants", { as: "permissive", for: "select", to: ["public"] }),
]);

export const storeProductReviews = pgTable("store_product_reviews", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	productId: uuid("product_id").notNull(),
	reviewerName: text("reviewer_name").notNull(),
	reviewerEmail: text("reviewer_email"),
	rating: integer().notNull(),
	commentText: text("comment_text"),
	isApproved: boolean("is_approved").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [storeProducts.id],
			name: "store_product_reviews_product_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Editors can manage store_product_reviews", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read store_product_reviews", { as: "permissive", for: "select", to: ["public"] }),
	check("store_product_reviews_rating_check", sql`(rating >= 1) AND (rating <= 5)`),
]);

export const storeOrderStatuses = pgTable("store_order_statuses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	color: text().default('#64748b'),
	icon: text().default('circle'),
	isDefault: boolean("is_default").default(false),
	isFinal: boolean("is_final").default(false),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Editors can manage store_order_statuses", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text])` }),
	pgPolicy("Public read store_order_statuses", { as: "permissive", for: "select", to: ["public"] }),
]);

export const storeOrders = pgTable("store_orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderNumber: text("order_number").notNull(),
	statusId: uuid("status_id"),
	customerName: text("customer_name").notNull(),
	customerEmail: text("customer_email"),
	customerPhone: text("customer_phone"),
	shippingAddress: jsonb("shipping_address").default({}).notNull(),
	subtotal: numeric({ precision: 10, scale:  2 }).default('0').notNull(),
	discountTotal: numeric("discount_total", { precision: 10, scale:  2 }).default('0').notNull(),
	shippingTotal: numeric("shipping_total", { precision: 10, scale:  2 }).default('0').notNull(),
	grandTotal: numeric("grand_total", { precision: 10, scale:  2 }).default('0').notNull(),
	couponId: uuid("coupon_id"),
	trackingNumber: text("tracking_number"),
	trackingUrl: text("tracking_url"),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.statusId],
			foreignColumns: [storeOrderStatuses.id],
			name: "store_orders_status_id_fkey"
		}).onDelete("restrict"),
	unique("store_orders_order_number_key").on(table.orderNumber),
	pgPolicy("Editors can manage store_orders", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text])` }),
]);

export const storeOrderItems = pgTable("store_order_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	productId: uuid("product_id"),
	variantId: uuid("variant_id"),
	productNameAr: text("product_name_ar").notNull(),
	productNameEn: text("product_name_en").notNull(),
	variantAttributes: jsonb("variant_attributes"),
	quantity: integer().default(1).notNull(),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [storeOrders.id],
			name: "store_order_items_order_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [storeProducts.id],
			name: "store_order_items_product_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [storeProductVariants.id],
			name: "store_order_items_variant_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Editors can manage store_order_items", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text])` }),
]);

export const storeOrderReturns = pgTable("store_order_returns", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	reasonText: text("reason_text").notNull(),
	status: text().default('pending').notNull(),
	refundAmount: numeric("refund_amount", { precision: 10, scale:  2 }),
	customerNotes: text("customer_notes"),
	adminNotes: text("admin_notes"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [storeOrders.id],
			name: "store_order_returns_order_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Editors can manage store_order_returns", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text])` }),
	check("store_order_returns_status_check", sql`status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'refunded'::text])`),
]);

export const storeCoupons = pgTable("store_coupons", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: text().notNull(),
	descriptionAr: text("description_ar").default(''),
	descriptionEn: text("description_en").default(''),
	discountType: text("discount_type").notNull(),
	discountValue: numeric("discount_value", { precision: 10, scale:  2 }).notNull(),
	minOrderAmount: numeric("min_order_amount", { precision: 10, scale:  2 }),
	maxDiscountAmount: numeric("max_discount_amount", { precision: 10, scale:  2 }),
	startsAt: timestamp("starts_at", { withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	usageLimit: integer("usage_limit"),
	usedCount: integer("used_count").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("store_coupons_code_key").on(table.code),
	pgPolicy("Editors can manage store_coupons", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text])` }),
	pgPolicy("Public read store_coupons", { as: "permissive", for: "select", to: ["public"] }),
	check("store_coupons_discount_type_check", sql`discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text])`),
]);

export const storeCampaigns = pgTable("store_campaigns", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	descriptionAr: text("description_ar").default(''),
	descriptionEn: text("description_en").default(''),
	bannerImageId: uuid("banner_image_id"),
	startsAt: timestamp("starts_at", { withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.bannerImageId],
			foreignColumns: [media.id],
			name: "store_campaigns_banner_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Editors can manage store_campaigns", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read store_campaigns", { as: "permissive", for: "select", to: ["public"] }),
]);

export const storeOffers = pgTable("store_offers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	descriptionAr: text("description_ar").default(''),
	descriptionEn: text("description_en").default(''),
	discountType: text("discount_type").notNull(),
	discountValue: numeric("discount_value", { precision: 10, scale:  2 }).notNull(),
	productId: uuid("product_id"),
	categoryId: uuid("category_id"),
	bannerImageId: uuid("banner_image_id"),
	startsAt: timestamp("starts_at", { withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.bannerImageId],
			foreignColumns: [media.id],
			name: "store_offers_banner_image_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [storeCategories.id],
			name: "store_offers_category_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [storeProducts.id],
			name: "store_offers_product_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Editors can manage store_offers", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read store_offers", { as: "permissive", for: "select", to: ["public"] }),
	check("store_offers_discount_type_check", sql`discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text])`),
]);

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

export const aboutHero = pgTable("about_hero", {
	id: integer().default(1).primaryKey().notNull(),
	titleAr: text("title_ar").default('').notNull(),
	titleEn: text("title_en").default('').notNull(),
	subtitleAr: text("subtitle_ar"),
	subtitleEn: text("subtitle_en"),
	backgroundImageId: uuid("background_image_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.backgroundImageId],
			foreignColumns: [media.id],
			name: "about_hero_background_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Authenticated users can read about_hero", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can update about_hero", { as: "permissive", for: "update", to: ["authenticated"] }),
	check("about_hero_id_check", sql`id = 1`),
]);

export const aboutCompany = pgTable("about_company", {
	id: integer().default(1).primaryKey().notNull(),
	storyAr: text("story_ar").default('').notNull(),
	storyEn: text("story_en").default('').notNull(),
	foundingYear: integer("founding_year"),
	founderNameAr: text("founder_name_ar"),
	founderNameEn: text("founder_name_en"),
	coverImageId: uuid("cover_image_id"),
	galleryImageIds: uuid("gallery_image_ids").array().default([""]),
	youtubeUrl: text("youtube_url"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.coverImageId],
			foreignColumns: [media.id],
			name: "about_company_cover_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Authenticated users can read about_company", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can update about_company", { as: "permissive", for: "update", to: ["authenticated"] }),
	check("about_company_id_check", sql`id = 1`),
]);

export const aboutMission = pgTable("about_mission", {
	id: integer().default(1).primaryKey().notNull(),
	missionAr: text("mission_ar").default('').notNull(),
	missionEn: text("mission_en").default('').notNull(),
	visionAr: text("vision_ar").default('').notNull(),
	visionEn: text("vision_en").default('').notNull(),
	philosophyAr: text("philosophy_ar"),
	philosophyEn: text("philosophy_en"),
	missionIcon: text("mission_icon").default('target'),
	visionIcon: text("vision_icon").default('eye'),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Authenticated users can read about_mission", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can update about_mission", { as: "permissive", for: "update", to: ["authenticated"] }),
	check("about_mission_id_check", sql`id = 1`),
]);

export const aboutValues = pgTable("about_values", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	iconName: text("icon_name").default('heart'),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Authenticated users can delete about_values", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can insert about_values", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Authenticated users can read about_values", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Authenticated users can update about_values", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const aboutTimeline = pgTable("about_timeline", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	year: integer().notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	imageId: uuid("image_id"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "about_timeline_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Authenticated users can delete about_timeline", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can insert about_timeline", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Authenticated users can read about_timeline", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Authenticated users can update about_timeline", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const aboutTeamMembers = pgTable("about_team_members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	roleAr: text("role_ar").notNull(),
	roleEn: text("role_en").notNull(),
	bioAr: text("bio_ar"),
	bioEn: text("bio_en"),
	avatarId: uuid("avatar_id"),
	email: text(),
	phone: text(),
	linkedinUrl: text("linkedin_url"),
	twitterUrl: text("twitter_url"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.avatarId],
			foreignColumns: [media.id],
			name: "about_team_members_avatar_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Authenticated users can delete about_team_members", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can insert about_team_members", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Authenticated users can read about_team_members", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Authenticated users can update about_team_members", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const aboutStats = pgTable("about_stats", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	labelAr: text("label_ar").notNull(),
	labelEn: text("label_en").notNull(),
	numericValue: integer("numeric_value").default(0).notNull(),
	suffix: text().default('+'),
	iconName: text("icon_name").default('bar-chart-2'),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Authenticated users can delete about_stats", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can insert about_stats", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Authenticated users can read about_stats", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Authenticated users can update about_stats", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const aboutCertificates = pgTable("about_certificates", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	issuerAr: text("issuer_ar"),
	issuerEn: text("issuer_en"),
	year: integer(),
	imageId: uuid("image_id"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "about_certificates_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Authenticated users can delete about_certificates", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can insert about_certificates", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Authenticated users can read about_certificates", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Authenticated users can update about_certificates", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const aboutSeo = pgTable("about_seo", {
	id: integer().default(1).primaryKey().notNull(),
	metaTitleAr: text("meta_title_ar"),
	metaTitleEn: text("meta_title_en"),
	metaDescriptionAr: text("meta_description_ar"),
	metaDescriptionEn: text("meta_description_en"),
	ogImageId: uuid("og_image_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.ogImageId],
			foreignColumns: [media.id],
			name: "about_seo_og_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("Authenticated users can read about_seo", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can update about_seo", { as: "permissive", for: "update", to: ["authenticated"] }),
	check("about_seo_id_check", sql`id = 1`),
]);

export const homepageSeo = pgTable("homepage_seo", {
	id: integer().default(1).primaryKey().notNull(),
	metaTitleAr: text("meta_title_ar"),
	metaTitleEn: text("meta_title_en"),
	metaDescriptionAr: text("meta_description_ar"),
	metaDescriptionEn: text("meta_description_en"),
	ogImageId: uuid("og_image_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.ogImageId],
			foreignColumns: [media.id],
			name: "homepage_seo_og_image_id_fkey"
		}),
	pgPolicy("Authenticated users can insert homepage_seo", { as: "permissive", for: "insert", to: ["authenticated"], withCheck: sql`true`  }),
	pgPolicy("Authenticated users can read homepage_seo", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Authenticated users can update homepage_seo", { as: "permissive", for: "update", to: ["authenticated"] }),
	check("homepage_seo_id_check", sql`id = 1`),
]);

export const homepageStats = pgTable("homepage_stats", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	labelAr: text("label_ar").notNull(),
	labelEn: text("label_en").notNull(),
	numericValue: integer("numeric_value").default(0).notNull(),
	suffix: text().default('+'),
	iconName: text("icon_name").default('bar-chart-2'),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Authenticated users can delete homepage_stats", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can insert homepage_stats", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Authenticated users can read homepage_stats", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Authenticated users can update homepage_stats", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const homepageCta = pgTable("homepage_cta", {
	id: integer().default(1).primaryKey().notNull(),
	titleAr: text("title_ar").default(''),
	titleEn: text("title_en").default(''),
	subtitleAr: text("subtitle_ar"),
	subtitleEn: text("subtitle_en"),
	buttonTextAr: text("button_text_ar"),
	buttonTextEn: text("button_text_en"),
	buttonLink: text("button_link"),
	backgroundImageId: uuid("background_image_id"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.backgroundImageId],
			foreignColumns: [media.id],
			name: "homepage_cta_background_image_id_fkey"
		}),
	pgPolicy("Authenticated users can insert homepage_cta", { as: "permissive", for: "insert", to: ["authenticated"], withCheck: sql`true`  }),
	pgPolicy("Authenticated users can read homepage_cta", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Authenticated users can update homepage_cta", { as: "permissive", for: "update", to: ["authenticated"] }),
	check("homepage_cta_id_check", sql`id = 1`),
]);

export const homepageFaq = pgTable("homepage_faq", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	questionAr: text("question_ar").notNull(),
	questionEn: text("question_en").notNull(),
	answerAr: text("answer_ar").notNull(),
	answerEn: text("answer_en").notNull(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Authenticated users can delete homepage_faq", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Authenticated users can insert homepage_faq", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Authenticated users can read homepage_faq", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Authenticated users can update homepage_faq", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const servicesSeo = pgTable("services_seo", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	metaTitleAr: text("meta_title_ar"),
	metaTitleEn: text("meta_title_en"),
	metaDescriptionAr: text("meta_description_ar"),
	metaDescriptionEn: text("meta_description_en"),
	ogImageId: uuid("og_image_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.ogImageId],
			foreignColumns: [media.id],
			name: "services_seo_og_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("auth insert services_seo", { as: "permissive", for: "insert", to: ["authenticated"], withCheck: sql`true`  }),
	pgPolicy("auth read services_seo", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("auth update services_seo", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const servicesCta = pgTable("services_cta", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleAr: text("title_ar"),
	titleEn: text("title_en"),
	subtitleAr: text("subtitle_ar"),
	subtitleEn: text("subtitle_en"),
	buttonTextAr: text("button_text_ar"),
	buttonTextEn: text("button_text_en"),
	buttonLink: text("button_link"),
	bgImageId: uuid("bg_image_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.bgImageId],
			foreignColumns: [media.id],
			name: "services_cta_bg_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("auth insert services_cta", { as: "permissive", for: "insert", to: ["authenticated"], withCheck: sql`true`  }),
	pgPolicy("auth read services_cta", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("auth update services_cta", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const servicesHero = pgTable("services_hero", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleAr: text("title_ar"),
	titleEn: text("title_en"),
	subtitleAr: text("subtitle_ar"),
	subtitleEn: text("subtitle_en"),
	badgeTextAr: text("badge_text_ar"),
	badgeTextEn: text("badge_text_en"),
	imageId: uuid("image_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [media.id],
			name: "services_hero_image_id_fkey"
		}).onDelete("set null"),
	pgPolicy("auth insert services_hero", { as: "permissive", for: "insert", to: ["authenticated"], withCheck: sql`true`  }),
	pgPolicy("auth read services_hero", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("auth update services_hero", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const servicesProcess = pgTable("services_process", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	serviceId: uuid("service_id").notNull(),
	stepNumber: integer("step_number").default(1),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	iconName: text("icon_name").default('check'),
	isActive: boolean("is_active").default(true),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.serviceId],
			foreignColumns: [services.id],
			name: "services_process_service_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("auth delete services_process", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
	pgPolicy("auth insert services_process", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("auth read services_process", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("auth update services_process", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const servicesPricing = pgTable("services_pricing", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	serviceId: uuid("service_id").notNull(),
	planNameAr: text("plan_name_ar").notNull(),
	planNameEn: text("plan_name_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	price: numeric({ precision: 10, scale:  2 }),
	currency: text().default('SAR'),
	billingPeriod: text("billing_period").default('monthly'),
	featuresAr: text("features_ar").array().default([""]),
	featuresEn: text("features_en").array().default([""]),
	isPopular: boolean("is_popular").default(false),
	isActive: boolean("is_active").default(true),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.serviceId],
			foreignColumns: [services.id],
			name: "services_pricing_service_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("auth delete services_pricing", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
	pgPolicy("auth insert services_pricing", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("auth read services_pricing", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("auth update services_pricing", { as: "permissive", for: "update", to: ["authenticated"] }),
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

export const storeCampaignProducts = pgTable("store_campaign_products", {
	campaignId: uuid("campaign_id").notNull(),
	productId: uuid("product_id").notNull(),
	overrideDiscountPercentage: numeric("override_discount_percentage", { precision: 5, scale:  2 }),
}, (table) => [
	foreignKey({
			columns: [table.campaignId],
			foreignColumns: [storeCampaigns.id],
			name: "store_campaign_products_campaign_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [storeProducts.id],
			name: "store_campaign_products_product_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.campaignId, table.productId], name: "store_campaign_products_pkey"}),
	pgPolicy("Editors can manage store_campaign_products", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public read store_campaign_products", { as: "permissive", for: "select", to: ["public"] }),
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
