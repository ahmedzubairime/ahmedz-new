import { media, mediaFolders } from "./media";
import { pgTable, index, foreignKey, pgPolicy, check, uuid, text, bigint, integer, timestamp, unique, boolean, jsonb, doublePrecision, numeric, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"






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
