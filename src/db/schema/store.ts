import { media, mediaFolders } from "./media";
import { pgTable, index, foreignKey, pgPolicy, check, uuid, text, bigint, integer, timestamp, unique, boolean, jsonb, doublePrecision, numeric, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"






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
