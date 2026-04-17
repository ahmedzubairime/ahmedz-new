-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folder_id" uuid,
	"bucket" text NOT NULL,
	"storage_path" text NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" bigint DEFAULT 0 NOT NULL,
	"width" integer,
	"height" integer,
	"alt_ar" text DEFAULT '',
	"alt_en" text DEFAULT '',
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "media_bucket_check" CHECK (bucket = ANY (ARRAY['images'::text, 'videos'::text, 'documents'::text]))
);
--> statement-breakpoint
ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "newsletter_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"status" text DEFAULT 'active' NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now(),
	"unsubscribed_at" timestamp with time zone,
	CONSTRAINT "newsletter_members_email_key" UNIQUE("email"),
	CONSTRAINT "newsletter_members_status_check" CHECK (status = ANY (ARRAY['active'::text, 'unsubscribed'::text]))
);
--> statement-breakpoint
ALTER TABLE "newsletter_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cms_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title_ar" text DEFAULT '' NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"content_ar" text DEFAULT '',
	"content_en" text DEFAULT '',
	"meta_title_ar" text DEFAULT '',
	"meta_title_en" text DEFAULT '',
	"meta_description_ar" text DEFAULT '',
	"meta_description_en" text DEFAULT '',
	"status" text DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "cms_pages_slug_key" UNIQUE("slug"),
	CONSTRAINT "cms_pages_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'published'::text]))
);
--> statement-breakpoint
ALTER TABLE "cms_pages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "newsletter_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_ar" text,
	"subject_en" text,
	"body_html_ar" text,
	"body_html_en" text,
	"target_locale" text DEFAULT 'both' NOT NULL,
	"status" text DEFAULT 'drafting' NOT NULL,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" uuid,
	CONSTRAINT "newsletter_campaigns_status_check" CHECK (status = ANY (ARRAY['drafting'::text, 'sending'::text, 'sent'::text])),
	CONSTRAINT "newsletter_campaigns_target_locale_check" CHECK (target_locale = ANY (ARRAY['both'::text, 'ar'::text, 'en'::text]))
);
--> statement-breakpoint
ALTER TABLE "newsletter_campaigns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"phone" text,
	"status" text DEFAULT 'pending_setup' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_status_check" CHECK (status = ANY (ARRAY['pending_setup'::text, 'active'::text, 'suspended'::text]))
);
--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_id_check" CHECK (id ~ '^[a-z0-9-]+$'::text)
);
--> statement-breakpoint
ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sections" (
	"id" text PRIMARY KEY NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"path" text NOT NULL,
	"icon" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sections_id_check" CHECK (id ~ '^[a-z0-9-]+$'::text)
);
--> statement-breakpoint
ALTER TABLE "sections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "page_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"section_id" text NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"icon" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_groups_id_check" CHECK (id ~ '^[a-z0-9.-]+$'::text)
);
--> statement-breakpoint
ALTER TABLE "page_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pages" (
	"id" text PRIMARY KEY NOT NULL,
	"group_id" text NOT NULL,
	"section_id" text NOT NULL,
	"parent_id" text,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"path" text NOT NULL,
	"icon" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_id_check" CHECK (id ~ '^[a-z0-9.-]+$'::text)
);
--> statement-breakpoint
ALTER TABLE "pages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"details" jsonb DEFAULT '{}'::jsonb,
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"preferred_locale" text DEFAULT 'ar' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"unsubscribed_at" timestamp with time zone,
	CONSTRAINT "newsletter_subscribers_email_key" UNIQUE("email"),
	CONSTRAINT "newsletter_subscribers_locale_check" CHECK (preferred_locale = ANY (ARRAY['ar'::text, 'en'::text])),
	CONSTRAINT "newsletter_subscribers_status_check" CHECK (status = ANY (ARRAY['active'::text, 'unsubscribed'::text]))
);
--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "post_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"slug" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "post_categories_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "post_categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "media_folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "media_folders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"author_id" uuid NOT NULL,
	"title_ar" text DEFAULT '' NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"slug" text NOT NULL,
	"content_ar" text DEFAULT '',
	"content_en" text DEFAULT '',
	"excerpt_ar" text DEFAULT '',
	"excerpt_en" text DEFAULT '',
	"cover_image" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"slug_ar" text,
	"slug_en" text,
	"cover_image_id" uuid,
	"status_ar" text DEFAULT 'draft' NOT NULL,
	"status_en" text DEFAULT 'draft' NOT NULL,
	"published_at_ar" timestamp with time zone,
	"published_at_en" timestamp with time zone,
	"seo_title_ar" text,
	"seo_description_ar" text,
	"seo_title_en" text,
	"seo_description_en" text,
	CONSTRAINT "posts_slug_key" UNIQUE("slug"),
	CONSTRAINT "posts_status_ar_check" CHECK (status_ar = ANY (ARRAY['draft'::text, 'scheduled'::text, 'published'::text])),
	CONSTRAINT "posts_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])),
	CONSTRAINT "posts_status_en_check" CHECK (status_en = ANY (ARRAY['draft'::text, 'scheduled'::text, 'published'::text]))
);
--> statement-breakpoint
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "homepage_partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text,
	"name_en" text,
	"website_url" text,
	"logo_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "homepage_partners" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"slug" text NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"image_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"icon_name" text DEFAULT 'briefcase',
	"long_description_ar" text,
	"long_description_en" text,
	"features_ar" text[] DEFAULT '{""}',
	"features_en" text[] DEFAULT '{""}',
	CONSTRAINT "services_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "services" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contact_info" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"email_primary" text,
	"email_support" text,
	"phone_primary" text,
	"phone_secondary" text,
	"address_ar" text,
	"address_en" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "contact_info_single_row" CHECK (id = 1)
);
--> statement-breakpoint
ALTER TABLE "contact_info" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "social_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"address_ar" text NOT NULL,
	"address_en" text NOT NULL,
	"phone" text,
	"email" text,
	"latitude" double precision,
	"longitude" double precision,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "branches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "services_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"image_id" uuid,
	"is_active" boolean DEFAULT true,
	"parent_id" uuid,
	CONSTRAINT "services_categories_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "services_categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "homepage_hero" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"title_ar" text DEFAULT '' NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"subtitle_ar" text,
	"subtitle_en" text,
	"cta_primary_text_ar" text,
	"cta_primary_text_en" text,
	"cta_primary_link" text,
	"image_id" uuid,
	"updated_at" timestamp with time zone DEFAULT now(),
	"cta_secondary_text_ar" text,
	"cta_secondary_text_en" text,
	"cta_secondary_link" text,
	"badge_text_ar" text,
	"badge_text_en" text,
	CONSTRAINT "homepage_hero_single_row" CHECK (id = 1)
);
--> statement-breakpoint
ALTER TABLE "homepage_hero" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "homepage_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"icon_name" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"image_id" uuid
);
--> statement-breakpoint
ALTER TABLE "homepage_features" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "homepage_testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_name_ar" text NOT NULL,
	"author_name_en" text NOT NULL,
	"role_ar" text,
	"role_en" text,
	"content_ar" text NOT NULL,
	"content_en" text NOT NULL,
	"avatar_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"rating" integer DEFAULT 5,
	CONSTRAINT "homepage_testimonials_rating_check" CHECK ((rating >= 1) AND (rating <= 5))
);
--> statement-breakpoint
ALTER TABLE "homepage_testimonials" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"slug" text NOT NULL,
	"description_ar" text DEFAULT '',
	"description_en" text DEFAULT '',
	"icon" text,
	"image_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "store_categories_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "store_categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"slug" text NOT NULL,
	"description_ar" text DEFAULT '',
	"description_en" text DEFAULT '',
	"base_price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"sale_price" numeric(10, 2),
	"sku" text,
	"barcode" text,
	"stock_quantity" integer DEFAULT 0,
	"cover_image_id" uuid,
	"gallery_images" uuid[] DEFAULT '{""}',
	"is_active" boolean DEFAULT true,
	"is_deleted" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "store_products_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "store_products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"sale_price" numeric(10, 2),
	"stock_quantity" integer DEFAULT 0,
	"attributes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"image_id" uuid,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "store_product_variants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_product_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"reviewer_name" text NOT NULL,
	"reviewer_email" text,
	"rating" integer NOT NULL,
	"comment_text" text,
	"is_approved" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "store_product_reviews_rating_check" CHECK ((rating >= 1) AND (rating <= 5))
);
--> statement-breakpoint
ALTER TABLE "store_product_reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_order_statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"color" text DEFAULT '#64748b',
	"icon" text DEFAULT 'circle',
	"is_default" boolean DEFAULT false,
	"is_final" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "store_order_statuses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"status_id" uuid,
	"customer_name" text NOT NULL,
	"customer_email" text,
	"customer_phone" text,
	"shipping_address" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"subtotal" numeric(10, 2) DEFAULT '0' NOT NULL,
	"discount_total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"shipping_total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"grand_total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"coupon_id" uuid,
	"tracking_number" text,
	"tracking_url" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "store_orders_order_number_key" UNIQUE("order_number")
);
--> statement-breakpoint
ALTER TABLE "store_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid,
	"variant_id" uuid,
	"product_name_ar" text NOT NULL,
	"product_name_en" text NOT NULL,
	"variant_attributes" jsonb,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "store_order_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_order_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"reason_text" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"refund_amount" numeric(10, 2),
	"customer_notes" text,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "store_order_returns_status_check" CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'refunded'::text]))
);
--> statement-breakpoint
ALTER TABLE "store_order_returns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"description_ar" text DEFAULT '',
	"description_en" text DEFAULT '',
	"discount_type" text NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"min_order_amount" numeric(10, 2),
	"max_discount_amount" numeric(10, 2),
	"starts_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"usage_limit" integer,
	"used_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "store_coupons_code_key" UNIQUE("code"),
	CONSTRAINT "store_coupons_discount_type_check" CHECK (discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text]))
);
--> statement-breakpoint
ALTER TABLE "store_coupons" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"description_ar" text DEFAULT '',
	"description_en" text DEFAULT '',
	"banner_image_id" uuid,
	"starts_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "store_campaigns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"description_ar" text DEFAULT '',
	"description_en" text DEFAULT '',
	"discount_type" text NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"product_id" uuid,
	"category_id" uuid,
	"banner_image_id" uuid,
	"starts_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "store_offers_discount_type_check" CHECK (discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text]))
);
--> statement-breakpoint
ALTER TABLE "store_offers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"slug" text NOT NULL,
	"status" text DEFAULT 'planning' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"color" text DEFAULT '#3b82f6',
	"start_date" date,
	"due_date" date,
	"completed_at" timestamp with time zone,
	"branch_id" uuid,
	"created_by" uuid,
	"budget" numeric(12, 2),
	"currency" text DEFAULT 'SAR',
	"is_archived" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pms_projects_slug_key" UNIQUE("slug"),
	CONSTRAINT "pms_projects_priority_check" CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text])),
	CONSTRAINT "pms_projects_status_check" CHECK (status = ANY (ARRAY['planning'::text, 'active'::text, 'on_hold'::text, 'completed'::text, 'archived'::text]))
);
--> statement-breakpoint
ALTER TABLE "pms_projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_project_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"project_role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pms_project_members_project_id_account_id_key" UNIQUE("project_id","account_id"),
	CONSTRAINT "pms_project_members_project_role_check" CHECK (project_role = ANY (ARRAY['owner'::text, 'manager'::text, 'member'::text, 'viewer'::text]))
);
--> statement-breakpoint
ALTER TABLE "pms_project_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_task_statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"color" text DEFAULT '#3b82f6',
	"icon" text DEFAULT 'circle',
	"sort_order" integer DEFAULT 0,
	"is_default" boolean DEFAULT false,
	"is_final" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pms_task_statuses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"color" text DEFAULT '#6366f1',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pms_labels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"status_id" uuid,
	"priority" text DEFAULT 'medium' NOT NULL,
	"assignee_id" uuid,
	"reporter_id" uuid,
	"parent_task_id" uuid,
	"due_date" date,
	"start_date" date,
	"completed_at" timestamp with time zone,
	"estimated_hours" numeric(6, 2),
	"logged_hours" numeric(6, 2) DEFAULT '0',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pms_tasks_priority_check" CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))
);
--> statement-breakpoint
ALTER TABLE "pms_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_task_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"content_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pms_task_comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_task_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"uploader_id" uuid NOT NULL,
	"media_id" uuid,
	"file_name" text NOT NULL,
	"file_size" bigint,
	"file_url" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pms_task_attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_time_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"duration_minutes" integer DEFAULT 0 NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pms_time_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"color" text DEFAULT '#3b82f6',
	"creator_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pms_teams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid,
	"action_type" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"project_id" uuid,
	"task_id" uuid,
	"details" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pms_activity_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "about_hero" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"title_ar" text DEFAULT '' NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"subtitle_ar" text,
	"subtitle_en" text,
	"background_image_id" uuid,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "about_hero_id_check" CHECK (id = 1)
);
--> statement-breakpoint
ALTER TABLE "about_hero" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "about_company" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"story_ar" text DEFAULT '' NOT NULL,
	"story_en" text DEFAULT '' NOT NULL,
	"founding_year" integer,
	"founder_name_ar" text,
	"founder_name_en" text,
	"cover_image_id" uuid,
	"gallery_image_ids" uuid[] DEFAULT '{""}',
	"youtube_url" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "about_company_id_check" CHECK (id = 1)
);
--> statement-breakpoint
ALTER TABLE "about_company" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "about_mission" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"mission_ar" text DEFAULT '' NOT NULL,
	"mission_en" text DEFAULT '' NOT NULL,
	"vision_ar" text DEFAULT '' NOT NULL,
	"vision_en" text DEFAULT '' NOT NULL,
	"philosophy_ar" text,
	"philosophy_en" text,
	"mission_icon" text DEFAULT 'target',
	"vision_icon" text DEFAULT 'eye',
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "about_mission_id_check" CHECK (id = 1)
);
--> statement-breakpoint
ALTER TABLE "about_mission" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "about_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"icon_name" text DEFAULT 'heart',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "about_values" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "about_timeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"image_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "about_timeline" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "about_team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"role_ar" text NOT NULL,
	"role_en" text NOT NULL,
	"bio_ar" text,
	"bio_en" text,
	"avatar_id" uuid,
	"email" text,
	"phone" text,
	"linkedin_url" text,
	"twitter_url" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "about_team_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "about_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label_ar" text NOT NULL,
	"label_en" text NOT NULL,
	"numeric_value" integer DEFAULT 0 NOT NULL,
	"suffix" text DEFAULT '+',
	"icon_name" text DEFAULT 'bar-chart-2',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "about_stats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "about_certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"issuer_ar" text,
	"issuer_en" text,
	"year" integer,
	"image_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "about_certificates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "about_seo" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"meta_title_ar" text,
	"meta_title_en" text,
	"meta_description_ar" text,
	"meta_description_en" text,
	"og_image_id" uuid,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "about_seo_id_check" CHECK (id = 1)
);
--> statement-breakpoint
ALTER TABLE "about_seo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "homepage_seo" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"meta_title_ar" text,
	"meta_title_en" text,
	"meta_description_ar" text,
	"meta_description_en" text,
	"og_image_id" uuid,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "homepage_seo_id_check" CHECK (id = 1)
);
--> statement-breakpoint
ALTER TABLE "homepage_seo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "homepage_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label_ar" text NOT NULL,
	"label_en" text NOT NULL,
	"numeric_value" integer DEFAULT 0 NOT NULL,
	"suffix" text DEFAULT '+',
	"icon_name" text DEFAULT 'bar-chart-2',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "homepage_stats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "homepage_cta" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"title_ar" text DEFAULT '',
	"title_en" text DEFAULT '',
	"subtitle_ar" text,
	"subtitle_en" text,
	"button_text_ar" text,
	"button_text_en" text,
	"button_link" text,
	"background_image_id" uuid,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "homepage_cta_id_check" CHECK (id = 1)
);
--> statement-breakpoint
ALTER TABLE "homepage_cta" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "homepage_faq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_ar" text NOT NULL,
	"question_en" text NOT NULL,
	"answer_ar" text NOT NULL,
	"answer_en" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "homepage_faq" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "services_seo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meta_title_ar" text,
	"meta_title_en" text,
	"meta_description_ar" text,
	"meta_description_en" text,
	"og_image_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "services_seo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "services_cta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text,
	"title_en" text,
	"subtitle_ar" text,
	"subtitle_en" text,
	"button_text_ar" text,
	"button_text_en" text,
	"button_link" text,
	"bg_image_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "services_cta" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "services_hero" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text,
	"title_en" text,
	"subtitle_ar" text,
	"subtitle_en" text,
	"badge_text_ar" text,
	"badge_text_en" text,
	"image_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "services_hero" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "services_process" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"step_number" integer DEFAULT 1,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"icon_name" text DEFAULT 'check',
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "services_process" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "services_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"plan_name_ar" text NOT NULL,
	"plan_name_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"price" numeric(10, 2),
	"currency" text DEFAULT 'SAR',
	"billing_period" text DEFAULT 'monthly',
	"features_ar" text[] DEFAULT '{""}',
	"features_en" text[] DEFAULT '{""}',
	"is_popular" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "services_pricing" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_task_labels" (
	"task_id" uuid NOT NULL,
	"label_id" uuid NOT NULL,
	CONSTRAINT "pms_task_labels_pkey" PRIMARY KEY("task_id","label_id")
);
--> statement-breakpoint
ALTER TABLE "pms_task_labels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "account_roles" (
	"account_id" uuid NOT NULL,
	"role_id" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "account_roles_pkey" PRIMARY KEY("account_id","role_id")
);
--> statement-breakpoint
ALTER TABLE "account_roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "store_campaign_products" (
	"campaign_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"override_discount_percentage" numeric(5, 2),
	CONSTRAINT "store_campaign_products_pkey" PRIMARY KEY("campaign_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "store_campaign_products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_project_teams" (
	"project_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pms_project_teams_pkey" PRIMARY KEY("project_id","team_id")
);
--> statement-breakpoint
ALTER TABLE "pms_project_teams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pms_team_members" (
	"team_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pms_team_members_pkey" PRIMARY KEY("team_id","account_id"),
	CONSTRAINT "pms_team_members_role_check" CHECK (role = ANY (ARRAY['owner'::text, 'manager'::text, 'member'::text]))
);
--> statement-breakpoint
ALTER TABLE "pms_team_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "role_page_permissions" (
	"role_id" text NOT NULL,
	"page_id" text NOT NULL,
	"can_create" boolean DEFAULT false NOT NULL,
	"can_read" boolean DEFAULT false NOT NULL,
	"can_update" boolean DEFAULT false NOT NULL,
	"can_delete" boolean DEFAULT false NOT NULL,
	CONSTRAINT "role_page_permissions_pkey" PRIMARY KEY("role_id","page_id")
);
--> statement-breakpoint
ALTER TABLE "role_page_permissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."media_folders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_campaigns" ADD CONSTRAINT "newsletter_campaigns_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_groups" ADD CONSTRAINT "page_groups_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."page_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_folders" ADD CONSTRAINT "media_folders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_folders" ADD CONSTRAINT "media_folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."media_folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homepage_partners" ADD CONSTRAINT "homepage_partners_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."services_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services_categories" ADD CONSTRAINT "services_categories_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services_categories" ADD CONSTRAINT "services_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."services_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homepage_hero" ADD CONSTRAINT "homepage_hero_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homepage_features" ADD CONSTRAINT "homepage_features_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homepage_testimonials" ADD CONSTRAINT "homepage_testimonials_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_categories" ADD CONSTRAINT "store_categories_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_categories" ADD CONSTRAINT "store_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."store_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."store_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_product_variants" ADD CONSTRAINT "store_product_variants_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_product_variants" ADD CONSTRAINT "store_product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."store_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_product_reviews" ADD CONSTRAINT "store_product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."store_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."store_order_statuses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_order_items" ADD CONSTRAINT "store_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."store_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_order_items" ADD CONSTRAINT "store_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."store_products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_order_items" ADD CONSTRAINT "store_order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."store_product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_order_returns" ADD CONSTRAINT "store_order_returns_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."store_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_campaigns" ADD CONSTRAINT "store_campaigns_banner_image_id_fkey" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_offers" ADD CONSTRAINT "store_offers_banner_image_id_fkey" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_offers" ADD CONSTRAINT "store_offers_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."store_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_offers" ADD CONSTRAINT "store_offers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."store_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD CONSTRAINT "pms_projects_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_projects" ADD CONSTRAINT "pms_projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_members" ADD CONSTRAINT "pms_project_members_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_members" ADD CONSTRAINT "pms_project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_tasks" ADD CONSTRAINT "pms_tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_tasks" ADD CONSTRAINT "pms_tasks_parent_task_id_fkey" FOREIGN KEY ("parent_task_id") REFERENCES "public"."pms_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_tasks" ADD CONSTRAINT "pms_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_tasks" ADD CONSTRAINT "pms_tasks_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_tasks" ADD CONSTRAINT "pms_tasks_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."pms_task_statuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_comments" ADD CONSTRAINT "pms_task_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_comments" ADD CONSTRAINT "pms_task_comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."pms_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_attachments" ADD CONSTRAINT "pms_task_attachments_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_attachments" ADD CONSTRAINT "pms_task_attachments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."pms_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_attachments" ADD CONSTRAINT "pms_task_attachments_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_time_entries" ADD CONSTRAINT "pms_time_entries_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_time_entries" ADD CONSTRAINT "pms_time_entries_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."pms_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_teams" ADD CONSTRAINT "pms_teams_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_activity_logs" ADD CONSTRAINT "pms_activity_logs_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_activity_logs" ADD CONSTRAINT "pms_activity_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_activity_logs" ADD CONSTRAINT "pms_activity_logs_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."pms_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "about_hero" ADD CONSTRAINT "about_hero_background_image_id_fkey" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "about_company" ADD CONSTRAINT "about_company_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "about_timeline" ADD CONSTRAINT "about_timeline_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "about_team_members" ADD CONSTRAINT "about_team_members_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "about_certificates" ADD CONSTRAINT "about_certificates_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "about_seo" ADD CONSTRAINT "about_seo_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homepage_seo" ADD CONSTRAINT "homepage_seo_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homepage_cta" ADD CONSTRAINT "homepage_cta_background_image_id_fkey" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services_seo" ADD CONSTRAINT "services_seo_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services_cta" ADD CONSTRAINT "services_cta_bg_image_id_fkey" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services_hero" ADD CONSTRAINT "services_hero_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services_process" ADD CONSTRAINT "services_process_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services_pricing" ADD CONSTRAINT "services_pricing_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_labels" ADD CONSTRAINT "pms_task_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "public"."pms_labels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_task_labels" ADD CONSTRAINT "pms_task_labels_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."pms_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_roles" ADD CONSTRAINT "account_roles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_roles" ADD CONSTRAINT "account_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_campaign_products" ADD CONSTRAINT "store_campaign_products_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."store_campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_campaign_products" ADD CONSTRAINT "store_campaign_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."store_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_teams" ADD CONSTRAINT "pms_project_teams_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."pms_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_project_teams" ADD CONSTRAINT "pms_project_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."pms_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_team_members" ADD CONSTRAINT "pms_team_members_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pms_team_members" ADD CONSTRAINT "pms_team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."pms_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_page_permissions" ADD CONSTRAINT "role_page_permissions_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_page_permissions" ADD CONSTRAINT "role_page_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_media_bucket" ON "media" USING btree ("bucket" text_ops);--> statement-breakpoint
CREATE INDEX "idx_media_created" ON "media" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_media_folder" ON "media" USING btree ("folder_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_newsletter_email" ON "newsletter_members" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "idx_newsletter_status" ON "newsletter_members" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_accounts_status" ON "accounts" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_page_groups_section" ON "page_groups" USING btree ("section_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_pages_group" ON "pages" USING btree ("group_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_pages_parent" ON "pages" USING btree ("parent_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_pages_section" ON "pages" USING btree ("section_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_audit_logs_actor" ON "audit_logs" USING btree ("actor_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_category" ON "posts" USING btree ("category_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_published" ON "posts" USING btree ("published_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_slug" ON "posts" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_status" ON "posts" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_projects_branch" ON "pms_projects" USING btree ("branch_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_projects_created_by" ON "pms_projects" USING btree ("created_by" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_projects_status" ON "pms_projects" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_project_members_account" ON "pms_project_members" USING btree ("account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_project_members_project" ON "pms_project_members" USING btree ("project_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_tasks_assignee" ON "pms_tasks" USING btree ("assignee_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_tasks_parent" ON "pms_tasks" USING btree ("parent_task_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_tasks_priority" ON "pms_tasks" USING btree ("priority" text_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_tasks_project" ON "pms_tasks" USING btree ("project_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_tasks_status" ON "pms_tasks" USING btree ("status_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_task_comments_task" ON "pms_task_comments" USING btree ("task_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_time_entries_account" ON "pms_time_entries" USING btree ("account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_time_entries_task" ON "pms_time_entries" USING btree ("task_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_teams_creator" ON "pms_teams" USING btree ("creator_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_activity_logs_account" ON "pms_activity_logs" USING btree ("account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_activity_logs_created" ON "pms_activity_logs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_activity_logs_project" ON "pms_activity_logs" USING btree ("project_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_activity_logs_task" ON "pms_activity_logs" USING btree ("task_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_account_roles_role" ON "account_roles" USING btree ("role_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_project_teams_project" ON "pms_project_teams" USING btree ("project_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_project_teams_team" ON "pms_project_teams" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_pms_team_members_account" ON "pms_team_members" USING btree ("account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_rpp_page" ON "role_page_permissions" USING btree ("page_id" text_ops);--> statement-breakpoint
CREATE POLICY "Authenticated users can read media" ON "media" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Content editors can manage media" ON "media" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage newsletter" ON "newsletter_members" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Content editors can manage pages" ON "cms_pages" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Published pages are public" ON "cms_pages" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Content editors can manage campaigns" ON "newsletter_campaigns" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Admins can read all accounts" ON "accounts" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM (account_roles ar
     JOIN roles r ON ((r.id = ar.role_id)))
  WHERE ((ar.account_id = auth.uid()) AND (ar.role_id = ANY (ARRAY['super-admin'::text, 'admin'::text]))))));--> statement-breakpoint
CREATE POLICY "Users can insert own account" ON "accounts" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can read own account" ON "accounts" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can update own account" ON "accounts" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Authenticated can read roles" ON "roles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Super-admins can manage roles" ON "roles" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Authenticated can read sections" ON "sections" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Super-admins can manage sections" ON "sections" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Authenticated can read page_groups" ON "page_groups" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Super-admins can manage page_groups" ON "page_groups" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Authenticated can read pages" ON "pages" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Super-admins can manage pages" ON "pages" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Admins can read logs" ON "audit_logs" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM account_roles ar
  WHERE ((ar.account_id = auth.uid()) AND (ar.role_id = ANY (ARRAY['super-admin'::text, 'admin'::text]))))));--> statement-breakpoint
CREATE POLICY "Content editors can manage subscribers" ON "newsletter_subscribers" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Admins can manage categories" ON "post_categories" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Authenticated users can read categories" ON "post_categories" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read folders" ON "media_folders" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Content editors can manage folders" ON "media_folders" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Content editors can manage posts" ON "posts" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Published posts are public" ON "posts" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage homepage_partners" ON "homepage_partners" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for homepage_partners" ON "homepage_partners" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage services" ON "services" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for services" ON "services" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage contact_info" ON "contact_info" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for contact_info" ON "contact_info" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage social_links" ON "social_links" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for social_links" ON "social_links" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage branches" ON "branches" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for branches" ON "branches" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage services_categories" ON "services_categories" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for services_categories" ON "services_categories" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage homepage_hero" ON "homepage_hero" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for homepage_hero" ON "homepage_hero" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage homepage_features" ON "homepage_features" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for homepage_features" ON "homepage_features" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage homepage_testimonials" ON "homepage_testimonials" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for homepage_testimonials" ON "homepage_testimonials" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage store_categories" ON "store_categories" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read store_categories" ON "store_categories" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage store_products" ON "store_products" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read store_products" ON "store_products" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage store_product_variants" ON "store_product_variants" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read store_product_variants" ON "store_product_variants" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage store_product_reviews" ON "store_product_reviews" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read store_product_reviews" ON "store_product_reviews" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage store_order_statuses" ON "store_order_statuses" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text]));--> statement-breakpoint
CREATE POLICY "Public read store_order_statuses" ON "store_order_statuses" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage store_orders" ON "store_orders" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text]));--> statement-breakpoint
CREATE POLICY "Editors can manage store_order_items" ON "store_order_items" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text]));--> statement-breakpoint
CREATE POLICY "Editors can manage store_order_returns" ON "store_order_returns" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text]));--> statement-breakpoint
CREATE POLICY "Editors can manage store_coupons" ON "store_coupons" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text]));--> statement-breakpoint
CREATE POLICY "Public read store_coupons" ON "store_coupons" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage store_campaigns" ON "store_campaigns" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read store_campaigns" ON "store_campaigns" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage store_offers" ON "store_offers" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read store_offers" ON "store_offers" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_projects_manage" ON "pms_projects" AS PERMISSIVE FOR ALL TO public USING (user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text]));--> statement-breakpoint
CREATE POLICY "pms_projects_read" ON "pms_projects" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_members_manage" ON "pms_project_members" AS PERMISSIVE FOR ALL TO public USING (user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text]));--> statement-breakpoint
CREATE POLICY "pms_members_read" ON "pms_project_members" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_statuses_manage" ON "pms_task_statuses" AS PERMISSIVE FOR ALL TO public USING (user_has_role(ARRAY['super-admin'::text, 'admin'::text]));--> statement-breakpoint
CREATE POLICY "pms_statuses_read" ON "pms_task_statuses" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_labels_manage" ON "pms_labels" AS PERMISSIVE FOR ALL TO public USING (user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'team-leader'::text]));--> statement-breakpoint
CREATE POLICY "pms_labels_read" ON "pms_labels" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_tasks_manage" ON "pms_tasks" AS PERMISSIVE FOR ALL TO public USING ((user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text]) OR (assignee_id = auth.uid())));--> statement-breakpoint
CREATE POLICY "pms_tasks_read" ON "pms_tasks" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_comments_manage" ON "pms_task_comments" AS PERMISSIVE FOR ALL TO public USING (((author_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text])));--> statement-breakpoint
CREATE POLICY "pms_comments_read" ON "pms_task_comments" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_attachments_manage" ON "pms_task_attachments" AS PERMISSIVE FOR ALL TO public USING (((uploader_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text])));--> statement-breakpoint
CREATE POLICY "pms_attachments_read" ON "pms_task_attachments" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_time_manage" ON "pms_time_entries" AS PERMISSIVE FOR ALL TO public USING (((account_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'team-leader'::text])));--> statement-breakpoint
CREATE POLICY "pms_time_read" ON "pms_time_entries" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_teams_manage" ON "pms_teams" AS PERMISSIVE FOR ALL TO public USING (user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text]));--> statement-breakpoint
CREATE POLICY "pms_teams_read" ON "pms_teams" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_logs_insert" ON "pms_activity_logs" AS PERMISSIVE FOR INSERT TO public WITH CHECK (((account_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text])));--> statement-breakpoint
CREATE POLICY "pms_logs_manage" ON "pms_activity_logs" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "pms_logs_read" ON "pms_activity_logs" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Authenticated users can read about_hero" ON "about_hero" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can update about_hero" ON "about_hero" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read about_company" ON "about_company" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can update about_company" ON "about_company" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read about_mission" ON "about_mission" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can update about_mission" ON "about_mission" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can delete about_values" ON "about_values" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can insert about_values" ON "about_values" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read about_values" ON "about_values" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can update about_values" ON "about_values" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can delete about_timeline" ON "about_timeline" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can insert about_timeline" ON "about_timeline" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read about_timeline" ON "about_timeline" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can update about_timeline" ON "about_timeline" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can delete about_team_members" ON "about_team_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can insert about_team_members" ON "about_team_members" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read about_team_members" ON "about_team_members" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can update about_team_members" ON "about_team_members" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can delete about_stats" ON "about_stats" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can insert about_stats" ON "about_stats" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read about_stats" ON "about_stats" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can update about_stats" ON "about_stats" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can delete about_certificates" ON "about_certificates" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can insert about_certificates" ON "about_certificates" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read about_certificates" ON "about_certificates" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can update about_certificates" ON "about_certificates" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read about_seo" ON "about_seo" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can update about_seo" ON "about_seo" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can insert homepage_seo" ON "homepage_seo" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can read homepage_seo" ON "homepage_seo" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can update homepage_seo" ON "homepage_seo" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can delete homepage_stats" ON "homepage_stats" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can insert homepage_stats" ON "homepage_stats" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read homepage_stats" ON "homepage_stats" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can update homepage_stats" ON "homepage_stats" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can insert homepage_cta" ON "homepage_cta" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can read homepage_cta" ON "homepage_cta" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can update homepage_cta" ON "homepage_cta" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can delete homepage_faq" ON "homepage_faq" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can insert homepage_faq" ON "homepage_faq" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can read homepage_faq" ON "homepage_faq" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can update homepage_faq" ON "homepage_faq" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth insert services_seo" ON "services_seo" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "auth read services_seo" ON "services_seo" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth update services_seo" ON "services_seo" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth insert services_cta" ON "services_cta" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "auth read services_cta" ON "services_cta" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth update services_cta" ON "services_cta" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth insert services_hero" ON "services_hero" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "auth read services_hero" ON "services_hero" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth update services_hero" ON "services_hero" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth delete services_process" ON "services_process" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "auth insert services_process" ON "services_process" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth read services_process" ON "services_process" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth update services_process" ON "services_process" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth delete services_pricing" ON "services_pricing" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "auth insert services_pricing" ON "services_pricing" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth read services_pricing" ON "services_pricing" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "auth update services_pricing" ON "services_pricing" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "pms_task_labels_manage" ON "pms_task_labels" AS PERMISSIVE FOR ALL TO public USING (user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text]));--> statement-breakpoint
CREATE POLICY "pms_task_labels_read" ON "pms_task_labels" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can read all account roles" ON "account_roles" AS PERMISSIVE FOR SELECT TO public USING (((account_id = auth.uid()) OR user_has_role(ARRAY['super-admin'::text, 'admin'::text])));--> statement-breakpoint
CREATE POLICY "Super-admins can manage account roles" ON "account_roles" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Users can read own roles" ON "account_roles" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Editors can manage store_campaign_products" ON "store_campaign_products" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read store_campaign_products" ON "store_campaign_products" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_project_teams_manage" ON "pms_project_teams" AS PERMISSIVE FOR ALL TO public USING (user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text]));--> statement-breakpoint
CREATE POLICY "pms_project_teams_read" ON "pms_project_teams" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "pms_team_members_manage" ON "pms_team_members" AS PERMISSIVE FOR ALL TO public USING (user_has_role(ARRAY['super-admin'::text, 'admin'::text, 'branch-manager'::text, 'team-leader'::text]));--> statement-breakpoint
CREATE POLICY "pms_team_members_read" ON "pms_team_members" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Authenticated can read permissions" ON "role_page_permissions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Super-admins can manage permissions" ON "role_page_permissions" AS PERMISSIVE FOR ALL TO public;
*/