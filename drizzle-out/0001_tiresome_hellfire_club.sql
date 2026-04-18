CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_ar" text NOT NULL,
	"company_en" text NOT NULL,
	"role_ar" text NOT NULL,
	"role_en" text NOT NULL,
	"sector_ar" text,
	"sector_en" text,
	"start_date" date NOT NULL,
	"end_date" date,
	"is_current" boolean DEFAULT false,
	"description_ar" text,
	"description_en" text,
	"logo_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cms_experiences" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cms_gallery_albums" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"description_ar" text,
	"description_en" text,
	"cover_image_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cms_gallery_albums" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cms_gallery_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"album_id" uuid,
	"title_ar" text,
	"title_en" text,
	"media_type" text DEFAULT 'image' NOT NULL,
	"media_id" uuid,
	"external_url" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cms_gallery_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cms_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"category" text DEFAULT 'skill' NOT NULL,
	"proficiency_level" integer DEFAULT 100,
	"icon_name" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cms_skills" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'unread' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_case_studies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"challenge_ar" text,
	"challenge_en" text,
	"solution_ar" text,
	"solution_en" text,
	"impact_ar" text,
	"impact_en" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "portfolio_case_studies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"title_en" text NOT NULL,
	"slug" text NOT NULL,
	"client_ar" text,
	"client_en" text,
	"description_ar" text,
	"description_en" text,
	"content_ar" text,
	"content_en" text,
	"results_ar" text,
	"results_en" text,
	"cover_image_id" uuid,
	"completion_date" date,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "portfolio_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "portfolio_projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cms_experiences" ADD CONSTRAINT "cms_experiences_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_gallery_albums" ADD CONSTRAINT "cms_gallery_albums_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_gallery_items" ADD CONSTRAINT "cms_gallery_items_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."cms_gallery_albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms_gallery_items" ADD CONSTRAINT "cms_gallery_items_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_case_studies" ADD CONSTRAINT "portfolio_case_studies_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Public read access for cms_experiences" ON "cms_experiences" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage cms_experiences" ON "cms_experiences" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for cms_gallery_albums" ON "cms_gallery_albums" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage cms_gallery_albums" ON "cms_gallery_albums" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for cms_gallery_items" ON "cms_gallery_items" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage cms_gallery_items" ON "cms_gallery_items" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for cms_skills" ON "cms_skills" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage cms_skills" ON "cms_skills" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Admins can manage contact_messages" ON "contact_messages" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public can insert contact_messages" ON "contact_messages" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Public read access for portfolio_case_studies" ON "portfolio_case_studies" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage portfolio_case_studies" ON "portfolio_case_studies" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));--> statement-breakpoint
CREATE POLICY "Public read access for portfolio_projects" ON "portfolio_projects" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage portfolio_projects" ON "portfolio_projects" AS PERMISSIVE FOR ALL TO public USING (auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));