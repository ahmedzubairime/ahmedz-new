import { accounts } from "./core";
import { users } from "./auth";
import { media, mediaFolders } from "./media";
import { pgTable, index, foreignKey, pgPolicy, check, uuid, text, bigint, integer, timestamp, unique, boolean, jsonb, doublePrecision, numeric, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"







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
