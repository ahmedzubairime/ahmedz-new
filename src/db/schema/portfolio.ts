import { media } from "./media";
import { pgTable, foreignKey, pgPolicy, uuid, text, integer, timestamp, boolean, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const cmsExperiences = pgTable("cms_experiences", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyAr: text("company_ar").notNull(),
	companyEn: text("company_en").notNull(),
	roleAr: text("role_ar").notNull(),
	roleEn: text("role_en").notNull(),
	sectorAr: text("sector_ar"),
	sectorEn: text("sector_en"),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),
	isCurrent: boolean("is_current").default(false),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	logoId: uuid("logo_id"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.logoId],
		foreignColumns: [media.id],
		name: "cms_experiences_logo_id_fkey"
	}).onDelete("set null"),
	pgPolicy("Public read access for cms_experiences", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can manage cms_experiences", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
]);

export const cmsSkills = pgTable("cms_skills", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nameAr: text("name_ar").notNull(),
	nameEn: text("name_en").notNull(),
	category: text("category").default('skill').notNull(),
	proficiencyLevel: integer("proficiency_level").default(100),
	iconName: text("icon_name"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Public read access for cms_skills", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can manage cms_skills", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
]);

export const portfolioProjects = pgTable("portfolio_projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	slug: text().unique().notNull(),
	clientAr: text("client_ar"),
	clientEn: text("client_en"),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	contentAr: text("content_ar"),
	contentEn: text("content_en"),
	resultsAr: text("results_ar"),
	resultsEn: text("results_en"),
	coverImageId: uuid("cover_image_id"),
	completionDate: date("completion_date"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.coverImageId],
		foreignColumns: [media.id],
		name: "portfolio_projects_cover_image_id_fkey"
	}).onDelete("set null"),
	pgPolicy("Public read access for portfolio_projects", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can manage portfolio_projects", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
]);

export const portfolioCaseStudies = pgTable("portfolio_case_studies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	projectId: uuid("project_id").notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	challengeAr: text("challenge_ar"),
	challengeEn: text("challenge_en"),
	solutionAr: text("solution_ar"),
	solutionEn: text("solution_en"),
	impactAr: text("impact_ar"),
	impactEn: text("impact_en"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.projectId],
		foreignColumns: [portfolioProjects.id],
		name: "portfolio_case_studies_project_id_fkey"
	}).onDelete("cascade"),
	pgPolicy("Public read access for portfolio_case_studies", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can manage portfolio_case_studies", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
]);

export const cmsGalleryAlbums = pgTable("cms_gallery_albums", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleAr: text("title_ar").notNull(),
	titleEn: text("title_en").notNull(),
	descriptionAr: text("description_ar"),
	descriptionEn: text("description_en"),
	coverImageId: uuid("cover_image_id"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.coverImageId],
		foreignColumns: [media.id],
		name: "cms_gallery_albums_cover_image_id_fkey"
	}).onDelete("set null"),
	pgPolicy("Public read access for cms_gallery_albums", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can manage cms_gallery_albums", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
]);

export const cmsGalleryItems = pgTable("cms_gallery_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	albumId: uuid("album_id"),
	titleAr: text("title_ar"),
	titleEn: text("title_en"),
	mediaType: text("media_type").default('image').notNull(),
	mediaId: uuid("media_id"),
	externalUrl: text("external_url"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.albumId],
		foreignColumns: [cmsGalleryAlbums.id],
		name: "cms_gallery_items_album_id_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.mediaId],
		foreignColumns: [media.id],
		name: "cms_gallery_items_media_id_fkey"
	}).onDelete("set null"),
	pgPolicy("Public read access for cms_gallery_items", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Admins can manage cms_gallery_items", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
]);

export const contactMessages = pgTable("contact_messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	phone: text(),
	subject: text(),
	message: text().notNull(),
	status: text().default('unread').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Admins can manage contact_messages", { as: "permissive", for: "all", to: ["public"], using: sql`auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text])` }),
	pgPolicy("Public can insert contact_messages", { as: "permissive", for: "insert", to: ["public"] }),
]);
