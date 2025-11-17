CREATE TABLE "admin_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "change_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"customer_id" varchar NOT NULL,
	"request_type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"priority" varchar DEFAULT 'medium',
	"status" varchar DEFAULT 'pending' NOT NULL,
	"admin_response" text,
	"estimated_hours" integer,
	"actual_hours" integer,
	"additional_cost" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "click_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"element" text NOT NULL,
	"page" text NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_onboarding" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_code" varchar NOT NULL,
	"full_name" varchar NOT NULL,
	"business_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"portal_password" varchar NOT NULL,
	"has_domain" varchar,
	"existing_domain" varchar,
	"desired_domains" text,
	"business_description" text NOT NULL,
	"pages_needed" text NOT NULL,
	"text_content" text,
	"has_images" boolean DEFAULT false,
	"has_logo" boolean DEFAULT false,
	"template_style" varchar,
	"template_variation" varchar DEFAULT 'light',
	"color_scheme" varchar NOT NULL,
	"layout_preference" varchar,
	"example_websites" text,
	"wants_contact_form" boolean DEFAULT false,
	"google_business_setup" boolean DEFAULT false,
	"social_media_links" text,
	"special_requests" text,
	"wants_user_auth" boolean DEFAULT false,
	"wants_database" boolean DEFAULT false,
	"wants_payment_processing" boolean DEFAULT false,
	"wants_crud_operations" boolean DEFAULT false,
	"wants_admin_panel" boolean DEFAULT false,
	"wants_production_features" boolean DEFAULT false,
	"selected_package" varchar NOT NULL,
	"desired_completion_date" timestamp,
	"setup_fees_paid" boolean DEFAULT false,
	"referred_by_code" varchar,
	"referral_discount" integer DEFAULT 0,
	"status" varchar DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "client_onboarding_client_code_unique" UNIQUE("client_code")
);
--> statement-breakpoint
CREATE TABLE "consultation_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"business_name" varchar NOT NULL,
	"service_type" varchar NOT NULL,
	"project_complexity" varchar NOT NULL,
	"timeline" varchar NOT NULL,
	"seo_setup" boolean DEFAULT false,
	"content_writing" boolean DEFAULT false,
	"ongoing_support" boolean DEFAULT false,
	"custom_integrations" boolean DEFAULT false,
	"ecommerce_features" boolean DEFAULT false,
	"project_description" text NOT NULL,
	"special_requests" text,
	"estimated_price" integer NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT '',
	"package" text DEFAULT '',
	"project_details" text DEFAULT '',
	"timeline" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"business_name" varchar,
	"client_code" varchar,
	"password" varchar,
	"desired_completion_date" timestamp,
	"client_onboarding_id" varchar,
	"gocardless_customer_id" varchar,
	"gocardless_mandate_id" varchar,
	"subscription_status" varchar DEFAULT 'inactive',
	"subscription_start_date" timestamp,
	"next_billing_date" timestamp,
	"package" varchar NOT NULL,
	"setup_fees_paid" boolean DEFAULT false,
	"monthly_fee" integer DEFAULT 1000,
	"google_business_setup" boolean DEFAULT false,
	"demo_mode" boolean DEFAULT false,
	"demo_approved" boolean DEFAULT false,
	"wants_user_auth" boolean DEFAULT false,
	"wants_database" boolean DEFAULT false,
	"wants_payment_processing" boolean DEFAULT false,
	"wants_crud_operations" boolean DEFAULT false,
	"wants_admin_panel" boolean DEFAULT false,
	"wants_production_features" boolean DEFAULT false,
	"referral_code" varchar,
	"referred_by_code" varchar,
	"referral_discount" integer DEFAULT 0,
	"total_referrals" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "customers_email_unique" UNIQUE("email"),
	CONSTRAINT "customers_client_code_unique" UNIQUE("client_code"),
	CONSTRAINT "customers_gocardless_customer_id_unique" UNIQUE("gocardless_customer_id"),
	CONSTRAINT "customers_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "design_approvals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"customer_id" varchar NOT NULL,
	"design_type" varchar NOT NULL,
	"design_title" varchar NOT NULL,
	"design_description" text,
	"design_image_url" varchar,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"customer_feedback" text,
	"submitted_at" timestamp DEFAULT now(),
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"invoice_number" varchar NOT NULL,
	"subtotal" integer NOT NULL,
	"vat_amount" integer DEFAULT 0,
	"total" integer NOT NULL,
	"status" varchar DEFAULT 'draft' NOT NULL,
	"issue_date" timestamp DEFAULT now(),
	"due_date" timestamp NOT NULL,
	"paid_date" timestamp,
	"description" text,
	"line_items" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page" text NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"referrer" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_code" varchar NOT NULL,
	"package" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"business_name" varchar NOT NULL,
	"account_holder_name" varchar NOT NULL,
	"sort_code" varchar NOT NULL,
	"account_number" varchar NOT NULL,
	"address" varchar NOT NULL,
	"city" varchar NOT NULL,
	"postcode" varchar NOT NULL,
	"google_business_setup" boolean DEFAULT false,
	"template_style" varchar,
	"template_variation" varchar DEFAULT 'light',
	"color_scheme" varchar,
	"layout_preference" varchar,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"project_status" varchar DEFAULT 'pending_payment' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payment_requests_client_code_unique" UNIQUE("client_code")
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_title" varchar NOT NULL,
	"client_name" varchar NOT NULL,
	"website_url" varchar NOT NULL,
	"image_url" varchar NOT NULL,
	"screenshot_url" varchar,
	"project_type" varchar NOT NULL,
	"industry" varchar,
	"features" text,
	"testimonial_text" text,
	"client_rating" integer,
	"is_public" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"project_completed_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_updates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"message" text NOT NULL,
	"image_url" varchar,
	"created_by" varchar DEFAULT 'Admin',
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"project_name" varchar NOT NULL,
	"project_description" text,
	"status" varchar DEFAULT 'planning' NOT NULL,
	"priority" varchar DEFAULT 'medium',
	"estimated_completion_date" timestamp,
	"actual_completion_date" timestamp,
	"domain_name" varchar,
	"pages_required" text,
	"design_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar NOT NULL,
	"client_onboarding_id" varchar,
	"gocardless_payment_id" varchar,
	"type" varchar NOT NULL,
	"description" varchar NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar DEFAULT 'GBP',
	"status" varchar NOT NULL,
	"billing_date" timestamp NOT NULL,
	"paid_date" timestamp,
	"failure_reason" text,
	"receipt_url" varchar,
	"receipt_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "transactions_gocardless_payment_id_unique" UNIQUE("gocardless_payment_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "website_update_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"business_name" varchar NOT NULL,
	"website_domain" varchar NOT NULL,
	"current_hosting_provider" varchar,
	"has_wp_access" varchar,
	"wp_login_details" text,
	"update_type" varchar NOT NULL,
	"update_description" text NOT NULL,
	"specific_changes" text,
	"estimated_cost" varchar,
	"account_holder_name" varchar,
	"sort_code" varchar,
	"account_number" varchar,
	"address" varchar,
	"city" varchar,
	"postcode" varchar,
	"agreed_to_terms" boolean DEFAULT false,
	"agreed_to_direct_debit" boolean DEFAULT false,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_client_onboarding_id_client_onboarding_id_fk" FOREIGN KEY ("client_onboarding_id") REFERENCES "public"."client_onboarding"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_approvals" ADD CONSTRAINT "design_approvals_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_approvals" ADD CONSTRAINT "design_approvals_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_client_onboarding_id_client_onboarding_id_fk" FOREIGN KEY ("client_onboarding_id") REFERENCES "public"."client_onboarding"("id") ON DELETE no action ON UPDATE no action;