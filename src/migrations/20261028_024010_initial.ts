import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'de', 'fr', 'it', 'hi', 'zh', 'ar');
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_home_hero_slides_kind" AS ENUM('image', 'youtube');
  CREATE TYPE "public"."enum_pages_blocks_home_hero_slides_cta_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_pages_blocks_home_hero_slides_secondary_cta_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_pages_blocks_ways_to_travel_tiles_tone" AS ENUM('sun', 'brand', 'ink');
  CREATE TYPE "public"."enum_pages_blocks_ways_to_travel_tiles_icon" AS ENUM('wheelchair', 'wallet', 'compass', 'herd', 'users', 'gift');
  CREATE TYPE "public"."enum_pages_blocks_ways_to_travel_tiles_link_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_pages_blocks_tours_rail_source" AS ENUM('featured', 'variant', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_tours_rail_variant" AS ENUM('standard', 'budget', 'accessible', 'migration');
  CREATE TYPE "public"."enum_pages_blocks_tours_rail_view_all_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_pages_blocks_offers_rail_view_all_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_cta_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_pages_blocks_rich_section_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_itinerary_days_meals" AS ENUM('breakfast', 'lunch', 'dinner');
  CREATE TYPE "public"."enum_pages_blocks_booking_card_mode" AS ENUM('tour', 'vehicle', 'joint');
  CREATE TYPE "public"."enum_pages_blocks_offer_banner_background_color" AS ENUM('gold', 'primary', 'background');
  CREATE TYPE "public"."enum_pages_blocks_price_matrix_mode" AS ENUM('manual');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_slides_kind" AS ENUM('image', 'youtube');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_slides_cta_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_slides_secondary_cta_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum__pages_v_blocks_ways_to_travel_tiles_tone" AS ENUM('sun', 'brand', 'ink');
  CREATE TYPE "public"."enum__pages_v_blocks_ways_to_travel_tiles_icon" AS ENUM('wheelchair', 'wallet', 'compass', 'herd', 'users', 'gift');
  CREATE TYPE "public"."enum__pages_v_blocks_ways_to_travel_tiles_link_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum__pages_v_blocks_tours_rail_source" AS ENUM('featured', 'variant', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_tours_rail_variant" AS ENUM('standard', 'budget', 'accessible', 'migration');
  CREATE TYPE "public"."enum__pages_v_blocks_tours_rail_view_all_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum__pages_v_blocks_offers_rail_view_all_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_cta_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_section_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_itinerary_days_meals" AS ENUM('breakfast', 'lunch', 'dinner');
  CREATE TYPE "public"."enum__pages_v_blocks_booking_card_mode" AS ENUM('tour', 'vehicle', 'joint');
  CREATE TYPE "public"."enum__pages_v_blocks_offer_banner_background_color" AS ENUM('gold', 'primary', 'background');
  CREATE TYPE "public"."enum__pages_v_blocks_price_matrix_mode" AS ENUM('manual');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'de', 'fr', 'it', 'hi', 'zh', 'ar');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'de', 'fr', 'it', 'hi', 'zh', 'ar');
  CREATE TYPE "public"."enum_tours_itinerary_meals" AS ENUM('breakfast', 'lunch', 'dinner');
  CREATE TYPE "public"."enum_tours_itinerary_mobility_level" AS ENUM('step-free', 'assisted', 'not-suitable');
  CREATE TYPE "public"."enum_tours_facts_pace" AS ENUM('easy', 'moderate', 'active');
  CREATE TYPE "public"."enum_vehicles_type" AS ENUM('land-cruiser', 'extended-land-cruiser', 'safari-van', 'rooftop-camper', 'accessible', 'transfer');
  CREATE TYPE "public"."enum_offers_type" AS ENUM('early-bird', 'seasonal', 'last-minute', 'group', 'added-value');
  CREATE TYPE "public"."enum_offers_discount_type" AS ENUM('percent', 'fixed', 'none');
  CREATE TYPE "public"."enum_joint_departures_status" AS ENUM('open', 'filling', 'guaranteed', 'full', 'cancelled');
  CREATE TYPE "public"."enum_destinations_country" AS ENUM('KE', 'TZ', 'UG', 'RW', 'other');
  CREATE TYPE "public"."enum_templates_sections_key" AS ENUM('facts', 'highlights', 'tabs', 'whyCheaper', 'accessibility', 'bestTime', 'reviews', 'faq', 'similar', 'departures', 'offerBanner');
  CREATE TYPE "public"."enum_templates_tabs_key" AS ENUM('itinerary', 'inclusions', 'exclusions', 'booking', 'gallery', 'videos', 'details', 'eligible', 'terms');
  CREATE TYPE "public"."enum_templates_variant" AS ENUM('standard', 'budget', 'accessible', 'migration', 'specialty', 'offer');
  CREATE TYPE "public"."enum_gallery_items_type" AS ENUM('photo', 'video');
  CREATE TYPE "public"."enum_inquiries_type" AS ENUM('tour', 'offer', 'vehicle', 'departure', 'general');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'lost');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_header_items_children_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_header_items_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_header_cta_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_footer_columns_links_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_footer_legal_links_route_key" AS ENUM('custom', 'home', 'tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TYPE "public"."enum_site_settings_social_platform" AS ENUM('facebook', 'instagram', 'youtube', 'tiktok', 'x', 'linkedin', 'tripadvisor');
  CREATE TYPE "public"."enum_routes_routes_key" AS ENUM('tours', 'disabilityTours', 'budgetTours', 'migrationTours', 'joinInTours', 'offers', 'vehicleHire', 'blog', 'gallery');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_home_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_pages_blocks_home_hero_slides_kind" DEFAULT 'image',
  	"image_id" integer,
  	"youtube_url" varchar,
  	"cta_route_key" "enum_pages_blocks_home_hero_slides_cta_route_key" DEFAULT 'custom',
  	"cta_url" varchar,
  	"secondary_cta_route_key" "enum_pages_blocks_home_hero_slides_secondary_cta_route_key" DEFAULT 'custom',
  	"secondary_cta_url" varchar,
  	"duration_seconds" numeric
  );
  
  CREATE TABLE "pages_blocks_home_hero_slides_locales" (
  	"headline" varchar,
  	"text" varchar,
  	"caption" varchar,
  	"cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 7,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_trip_finder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_ways_to_travel_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_pages_blocks_ways_to_travel_tiles_tone" DEFAULT 'brand',
  	"icon" "enum_pages_blocks_ways_to_travel_tiles_icon" DEFAULT 'compass',
  	"link_route_key" "enum_pages_blocks_ways_to_travel_tiles_link_route_key" DEFAULT 'custom',
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_ways_to_travel_tiles_locales" (
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_ways_to_travel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_ways_to_travel_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_tours_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_tours_rail_source" DEFAULT 'featured',
  	"variant" "enum_pages_blocks_tours_rail_variant",
  	"limit" numeric DEFAULT 4,
  	"view_all_route_key" "enum_pages_blocks_tours_rail_view_all_route_key" DEFAULT 'custom',
  	"view_all_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tours_rail_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"view_all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_departures_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 4,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_departures_band_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_offers_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"view_all_route_key" "enum_pages_blocks_offers_rail_view_all_route_key" DEFAULT 'custom',
  	"view_all_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_offers_rail_locales" (
  	"title" varchar,
  	"view_all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_destinations_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_destinations_rail_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_value_props_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_value_props_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_value_props" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_value_props_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_route_key" "enum_pages_blocks_cta_banner_cta_route_key" DEFAULT 'custom',
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_banner_locales" (
  	"title" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_blog_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blog_rail_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_header_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rich_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_side" "enum_pages_blocks_rich_section_image_side" DEFAULT 'right',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_section_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_strip_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_section_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_section_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_section_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_vehicle_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_vehicle_grid_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_media_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_gallery_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hotels_block_hotels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hotel_id" integer
  );
  
  CREATE TABLE "pages_blocks_hotels_block_hotels_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hotels_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_included_excluded_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_included_excluded_included_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_included_excluded_excluded" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_included_excluded_excluded_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_included_excluded" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_url" varchar,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_best_time_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_best_time_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_best_time_block_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_block_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_block_questions_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_block_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_link_hubs_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_link_hubs_block_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_link_hubs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_link_hubs_block_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_title_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_title_block_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_fact_chips_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_fact_chips_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_fact_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_sticky_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_sticky_tabs_tabs_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_sticky_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_itinerary_days_meals" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_itinerary_days_meals",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_itinerary_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hotel_id" integer
  );
  
  CREATE TABLE "pages_blocks_itinerary_days_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_overview_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_accessibility_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_accessibility_section_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_reviews_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"reviews_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_reviews_block_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_booking_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mode" "enum_pages_blocks_booking_card_mode" DEFAULT 'tour',
  	"reference_id" integer,
  	"tour_id" integer,
  	"vehicle_id" integer,
  	"joint_departure_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_booking_card_locales" (
  	"cta_text" varchar DEFAULT 'Book Now',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_similar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_similar_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_departure_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_upcoming" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_offer_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_id" integer,
  	"background_color" "enum_pages_blocks_offer_banner_background_color",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_author_box" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_author_box_locales" (
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_group_discount_table_discounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"min_people" numeric,
  	"max_people" numeric
  );
  
  CREATE TABLE "pages_blocks_group_discount_table_discounts_locales" (
  	"discount" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_group_discount_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_how_it_works_steps_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_terms_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_terms_faq_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band_locales" (
  	"title" varchar,
  	"button_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_features_safety_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_features_safety_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_features_safety" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_what_to_expect_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_what_to_expect_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_what_to_expect" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_specs_table_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_specs_table_specs_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_specs_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tours_using_vehicle" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tours_using_vehicle_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_seat_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_seat_map_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_price_table_table_data_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_price_table_table_data_row_locales" (
  	"cell" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_price_table_table_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_price_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_price_matrix" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mode" "enum_pages_blocks_price_matrix_mode" DEFAULT 'manual',
  	"currency" varchar DEFAULT 'USD',
  	"valid_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_policy_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_policy_block_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_category_tiles_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_category_tiles_categories_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_category_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_tiles_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_featured_tours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_tours_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"view_all_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_destination_tiles_destinations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_destination_tiles_destinations_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_destination_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_destination_tiles_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_social_feed_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_social_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_social_feed_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"tours_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__pages_v_blocks_home_hero_slides_kind" DEFAULT 'image',
  	"image_id" integer,
  	"youtube_url" varchar,
  	"cta_route_key" "enum__pages_v_blocks_home_hero_slides_cta_route_key" DEFAULT 'custom',
  	"cta_url" varchar,
  	"secondary_cta_route_key" "enum__pages_v_blocks_home_hero_slides_secondary_cta_route_key" DEFAULT 'custom',
  	"secondary_cta_url" varchar,
  	"duration_seconds" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero_slides_locales" (
  	"headline" varchar,
  	"text" varchar,
  	"caption" varchar,
  	"cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 7,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trip_finder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_ways_to_travel_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum__pages_v_blocks_ways_to_travel_tiles_tone" DEFAULT 'brand',
  	"icon" "enum__pages_v_blocks_ways_to_travel_tiles_icon" DEFAULT 'compass',
  	"link_route_key" "enum__pages_v_blocks_ways_to_travel_tiles_link_route_key" DEFAULT 'custom',
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_ways_to_travel_tiles_locales" (
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_ways_to_travel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_ways_to_travel_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_tours_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_tours_rail_source" DEFAULT 'featured',
  	"variant" "enum__pages_v_blocks_tours_rail_variant",
  	"limit" numeric DEFAULT 4,
  	"view_all_route_key" "enum__pages_v_blocks_tours_rail_view_all_route_key" DEFAULT 'custom',
  	"view_all_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tours_rail_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"view_all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_departures_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 4,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_departures_band_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_offers_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"view_all_route_key" "enum__pages_v_blocks_offers_rail_view_all_route_key" DEFAULT 'custom',
  	"view_all_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_offers_rail_locales" (
  	"title" varchar,
  	"view_all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_destinations_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_destinations_rail_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_value_props_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_value_props_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_value_props" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_value_props_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_route_key" "enum__pages_v_blocks_cta_banner_cta_route_key" DEFAULT 'custom',
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner_locales" (
  	"title" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_blog_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_blog_rail_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_header_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_rich_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_side" "enum__pages_v_blocks_rich_section_image_side" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_section_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_strip_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_section_items_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_section_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_section_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_vehicle_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_vehicle_grid_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_media_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_gallery_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hotels_block_hotels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hotel_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hotels_block_hotels_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hotels_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_included_excluded_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_included_excluded_included_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_included_excluded_excluded" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_included_excluded_excluded_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_included_excluded" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_url" varchar,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_best_time_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_best_time_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_best_time_block_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_block_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_block_questions_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_block_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_link_hubs_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_hubs_block_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_link_hubs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_hubs_block_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_title_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_title_block_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_fact_chips_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_fact_chips_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_fact_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sticky_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sticky_tabs_tabs_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_sticky_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_itinerary_days_meals" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_itinerary_days_meals",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_itinerary_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hotel_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_itinerary_days_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_overview_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_accessibility_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accessibility_section_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_reviews_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"reviews_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_reviews_block_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_booking_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mode" "enum__pages_v_blocks_booking_card_mode" DEFAULT 'tour',
  	"reference_id" integer,
  	"tour_id" integer,
  	"vehicle_id" integer,
  	"joint_departure_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_booking_card_locales" (
  	"cta_text" varchar DEFAULT 'Book Now',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_similar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_similar_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_departure_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_upcoming" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_offer_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_id" integer,
  	"background_color" "enum__pages_v_blocks_offer_banner_background_color",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_author_box" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_author_box_locales" (
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_group_discount_table_discounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"min_people" numeric,
  	"max_people" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_group_discount_table_discounts_locales" (
  	"discount" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_group_discount_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_how_it_works_steps_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_terms_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_terms_faq_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band_locales" (
  	"title" varchar,
  	"button_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_features_safety_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_safety_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_features_safety" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_what_to_expect_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_what_to_expect_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_what_to_expect" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_specs_table_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_specs_table_specs_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_specs_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tours_using_vehicle" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tours_using_vehicle_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_seat_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_seat_map_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_price_table_table_data_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_price_table_table_data_row_locales" (
  	"cell" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_price_table_table_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_price_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_price_matrix" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mode" "enum__pages_v_blocks_price_matrix_mode" DEFAULT 'manual',
  	"currency" varchar DEFAULT 'USD',
  	"valid_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_policy_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_policy_block_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_category_tiles_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_tiles_categories_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_category_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_tiles_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_featured_tours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_tours_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"view_all_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_destination_tiles_destinations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_destination_tiles_destinations_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_destination_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_destination_tiles_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_social_feed_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_social_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_social_feed_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_rich_text" jsonb,
  	"version_hero_media_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"tours_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit_text" varchar,
  	"copyright_notice" varchar,
  	"caption" jsonb,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar,\n\t  	"_objectkey" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "tours_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_highlights_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_itinerary_meals" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_tours_itinerary_meals",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hotel_id" integer,
  	"mobility_level" "enum_tours_itinerary_mobility_level"
  );
  
  CREATE TABLE "tours_itinerary_locales" (
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"drive_time" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_included_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_excluded" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_excluded_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_pricing_matrix" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"season_id" integer NOT NULL,
  	"p2" numeric NOT NULL,
  	"p4" numeric NOT NULL,
  	"p6" numeric NOT NULL,
  	"p8" numeric NOT NULL
  );
  
  CREATE TABLE "tours_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "tours_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"youtube_url" varchar NOT NULL,
  	"upload_date" timestamp(3) with time zone
  );
  
  CREATE TABLE "tours_videos_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_accessibility_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_accessibility_features_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_best_time" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_best_time_locales" (
  	"months" varchar NOT NULL,
  	"conditions" varchar NOT NULL,
  	"price_level" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_faq_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"sample" boolean DEFAULT false,
  	"template_id" integer NOT NULL,
  	"destination_id" integer NOT NULL,
  	"duration_days" numeric NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"facts_pace" "enum_tours_facts_pace",
  	"facts_group_size_min" numeric,
  	"facts_group_size_max" numeric,
  	"itinerary_pdf_id" integer,
  	"pricing_valid_until" timestamp(3) with time zone,
  	"accessibility_vehicle_id" integer,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tours_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"description" jsonb,
  	"facts_start_point" varchar,
  	"facts_end_point" varchar,
  	"facts_guide_languages" varchar,
  	"why_cheaper" varchar,
  	"accessibility_summary" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tours_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tours_id" integer
  );
  
  CREATE TABLE "vehicles_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "vehicles_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "vehicles_features_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vehicles_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "vehicles_specs_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vehicles_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"price_cents" numeric NOT NULL
  );
  
  CREATE TABLE "vehicles_rates_locales" (
  	"label" varchar NOT NULL,
  	"unit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "vehicles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"sample" boolean DEFAULT false,
  	"type" "enum_vehicles_type" NOT NULL,
  	"seats" numeric NOT NULL,
  	"hero_image_id" integer,
  	"accessible" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vehicles_locales" (
  	"name" varchar NOT NULL,
  	"summary" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "seasons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"start_month" numeric NOT NULL,
  	"start_day" numeric NOT NULL,
  	"end_month" numeric NOT NULL,
  	"end_day" numeric NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "seasons_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "offers_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "offers_how_it_works_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"sample" boolean DEFAULT false,
  	"type" "enum_offers_type" NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"discount_type" "enum_offers_discount_type" DEFAULT 'percent' NOT NULL,
  	"discount_value" numeric,
  	"valid_from" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone NOT NULL,
  	"travel_from" timestamp(3) with time zone,
  	"travel_until" timestamp(3) with time zone,
  	"min_guests" numeric,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "offers_locales" (
  	"name" varchar NOT NULL,
  	"badge_text" varchar,
  	"summary" varchar NOT NULL,
  	"description" varchar,
  	"terms" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "offers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer
  );
  
  CREATE TABLE "hotels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stars" numeric,
  	"image_id" integer,
  	"step_free" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hotels_locales" (
  	"name" varchar NOT NULL,
  	"location" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "joint_departures" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tour_id" integer NOT NULL,
  	"slug" varchar,
  	"published" boolean DEFAULT true,
  	"sample" boolean DEFAULT false,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"price_per_seat" numeric NOT NULL,
  	"total_seats" numeric NOT NULL,
  	"min_guests_to_run" numeric,
  	"status" "enum_joint_departures_status" DEFAULT 'open' NOT NULL,
  	"vehicle_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "joint_departures_locales" (
  	"meeting_point" varchar,
  	"notes" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "destinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"country" "enum_destinations_country",
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "destinations_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "templates_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_templates_sections_key" NOT NULL,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "templates_sections_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "templates_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_templates_tabs_key" NOT NULL,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "templates_tabs_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"variant" "enum_templates_variant" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_gallery_items_type" DEFAULT 'photo' NOT NULL,
  	"published" boolean DEFAULT true,
  	"sample" boolean DEFAULT false,
  	"image_id" integer NOT NULL,
  	"youtube_url" varchar,
  	"destination_id" integer,
  	"sort" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_items_locales" (
  	"title" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_inquiries_type" NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"country_iso" varchar,
  	"tour_id" integer,
  	"offer_id" integer,
  	"vehicle_id" integer,
  	"departure_id" integer,
  	"guests" varchar,
  	"travel_date" timestamp(3) with time zone,
  	"season" varchar,
  	"currency" varchar,
  	"estimate_usd_cents" numeric,
  	"message" varchar,
  	"wants_pdf" boolean,
  	"consent" boolean,
  	"source_path" varchar,
  	"locale" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"priority" numeric,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"users_id" integer,
  	"tours_id" integer,
  	"vehicles_id" integer,
  	"seasons_id" integer,
  	"offers_id" integer,
  	"hotels_id" integer,
  	"joint_departures_id" integer,
  	"destinations_id" integer,
  	"templates_id" integer,
  	"gallery_items_id" integer,
  	"inquiries_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"search_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route_key" "enum_header_items_children_route_key" DEFAULT 'custom' NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "header_items_children_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route_key" "enum_header_items_route_key" DEFAULT 'custom' NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "header_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_route_key" "enum_header_cta_route_key" DEFAULT 'custom' NOT NULL,
  	"cta_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_locales" (
  	"cta_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route_key" "enum_footer_columns_links_route_key" DEFAULT 'custom' NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"route_key" "enum_footer_legal_links_route_key" DEFAULT 'custom' NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "footer_legal_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_trust" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_trust_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_payment_methods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_currencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"rate" numeric NOT NULL,
  	"rate_date" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"whatsapp_number" varchar NOT NULL,
  	"min_lead_days" numeric DEFAULT 2,
  	"seo_default_og_image_id" integer,
  	"seo_canonical_origin" varchar,
  	"seo_enable_faq_schema" boolean DEFAULT true,
  	"seo_google_site_verification" varchar,
  	"seo_merchant_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"site_name" varchar NOT NULL,
  	"whatsapp_message" varchar,
  	"reply_time" varchar,
  	"cancellation_summary" varchar,
  	"deposit_summary" varchar,
  	"seo_title_suffix" varchar DEFAULT 'JaeTravel Expeditions',
  	"seo_default_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "company_credentials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "company_credentials_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "company" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"phone_number" varchar NOT NULL,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_region" varchar,
  	"address_postal_code" varchar,
  	"address_country_code" varchar DEFAULT 'KE',
  	"geo_lat" numeric,
  	"geo_lng" numeric,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "company_locales" (
  	"company_name" varchar NOT NULL,
  	"tagline" varchar,
  	"opening_hours" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" varchar DEFAULT '#FF7302' NOT NULL,
  	"on_brand" varchar DEFAULT '#201E1F' NOT NULL,
  	"accent_text" varchar DEFAULT '#B34A00' NOT NULL,
  	"sun" varchar DEFAULT '#FFDD00' NOT NULL,
  	"ink" varchar DEFAULT '#201E1F' NOT NULL,
  	"ground" varchar DEFAULT '#FFFFFF' NOT NULL,
  	"surface" varchar DEFAULT '#FFFFFF' NOT NULL,
  	"tint" varchar DEFAULT '#FFF2C2' NOT NULL,
  	"line" varchar DEFAULT '#E6D9CB' NOT NULL,
  	"muted" varchar DEFAULT '#56585B' NOT NULL,
  	"soft" varchar DEFAULT '#BDB7AE' NOT NULL,
  	"night" varchar DEFAULT '#201E1F' NOT NULL,
  	"on_night" varchar DEFAULT '#F7F2EA' NOT NULL,
  	"success" varchar DEFAULT '#2E7D4F' NOT NULL,
  	"danger" varchar DEFAULT '#B3261E' NOT NULL,
  	"whatsapp" varchar DEFAULT '#25D366' NOT NULL,
  	"dark_ground" varchar DEFAULT '#151311' NOT NULL,
  	"dark_surface" varchar DEFAULT '#211F1C' NOT NULL,
  	"dark_tint" varchar DEFAULT '#1B1917' NOT NULL,
  	"dark_ink" varchar DEFAULT '#F5F1EB' NOT NULL,
  	"dark_muted" varchar DEFAULT '#B8B1A7' NOT NULL,
  	"dark_line" varchar DEFAULT '#3A3631' NOT NULL,
  	"dark_night" varchar DEFAULT '#0F0E0D' NOT NULL,
  	"dark_accent_text" varchar DEFAULT '#FF9340' NOT NULL,
  	"dark_success" varchar DEFAULT '#6CC38E' NOT NULL,
  	"dark_danger" varchar DEFAULT '#FF8A7A' NOT NULL,
  	"radius_card" numeric DEFAULT 16,
  	"radius_panel" numeric DEFAULT 22,
  	"pop_shadow" numeric DEFAULT 6,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "routes_routes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_routes_routes_key" NOT NULL,
  	"prefix" varchar NOT NULL
  );
  
  CREATE TABLE "routes_routes_locales" (
  	"breadcrumb_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "routes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "translations_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "translations_entries_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "translations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_slides" ADD CONSTRAINT "pages_blocks_home_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_slides" ADD CONSTRAINT "pages_blocks_home_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_slides_locales" ADD CONSTRAINT "pages_blocks_home_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero" ADD CONSTRAINT "pages_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trip_finder" ADD CONSTRAINT "pages_blocks_trip_finder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ways_to_travel_tiles" ADD CONSTRAINT "pages_blocks_ways_to_travel_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ways_to_travel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ways_to_travel_tiles_locales" ADD CONSTRAINT "pages_blocks_ways_to_travel_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ways_to_travel_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ways_to_travel" ADD CONSTRAINT "pages_blocks_ways_to_travel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ways_to_travel_locales" ADD CONSTRAINT "pages_blocks_ways_to_travel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ways_to_travel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tours_rail" ADD CONSTRAINT "pages_blocks_tours_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tours_rail_locales" ADD CONSTRAINT "pages_blocks_tours_rail_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tours_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_departures_band" ADD CONSTRAINT "pages_blocks_departures_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_departures_band_locales" ADD CONSTRAINT "pages_blocks_departures_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_departures_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_offers_rail" ADD CONSTRAINT "pages_blocks_offers_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_offers_rail_locales" ADD CONSTRAINT "pages_blocks_offers_rail_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_offers_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_destinations_rail" ADD CONSTRAINT "pages_blocks_destinations_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_destinations_rail_locales" ADD CONSTRAINT "pages_blocks_destinations_rail_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_destinations_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_props_items" ADD CONSTRAINT "pages_blocks_value_props_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_props"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_props_items_locales" ADD CONSTRAINT "pages_blocks_value_props_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_props_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_props" ADD CONSTRAINT "pages_blocks_value_props_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_props_locales" ADD CONSTRAINT "pages_blocks_value_props_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_props"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner_locales" ADD CONSTRAINT "pages_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_rail" ADD CONSTRAINT "pages_blocks_blog_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_rail_locales" ADD CONSTRAINT "pages_blocks_blog_rail_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_blog_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header_locales" ADD CONSTRAINT "pages_blocks_page_header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_section" ADD CONSTRAINT "pages_blocks_rich_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_section" ADD CONSTRAINT "pages_blocks_rich_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_section_locales" ADD CONSTRAINT "pages_blocks_rich_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_strip_items" ADD CONSTRAINT "pages_blocks_stats_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_strip_items_locales" ADD CONSTRAINT "pages_blocks_stats_strip_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_strip_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_strip" ADD CONSTRAINT "pages_blocks_stats_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section_items" ADD CONSTRAINT "pages_blocks_faq_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section_items_locales" ADD CONSTRAINT "pages_blocks_faq_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section" ADD CONSTRAINT "pages_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section_locales" ADD CONSTRAINT "pages_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section" ADD CONSTRAINT "pages_blocks_contact_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section_locales" ADD CONSTRAINT "pages_blocks_contact_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_vehicle_grid" ADD CONSTRAINT "pages_blocks_vehicle_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_vehicle_grid_locales" ADD CONSTRAINT "pages_blocks_vehicle_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_vehicle_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_gallery" ADD CONSTRAINT "pages_blocks_media_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_gallery_locales" ADD CONSTRAINT "pages_blocks_media_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hotels_block_hotels" ADD CONSTRAINT "pages_blocks_hotels_block_hotels_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hotels_block_hotels" ADD CONSTRAINT "pages_blocks_hotels_block_hotels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hotels_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hotels_block_hotels_locales" ADD CONSTRAINT "pages_blocks_hotels_block_hotels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hotels_block_hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hotels_block" ADD CONSTRAINT "pages_blocks_hotels_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_included_excluded_included" ADD CONSTRAINT "pages_blocks_included_excluded_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_included_excluded"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_included_excluded_included_locales" ADD CONSTRAINT "pages_blocks_included_excluded_included_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_included_excluded_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_included_excluded_excluded" ADD CONSTRAINT "pages_blocks_included_excluded_excluded_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_included_excluded"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_included_excluded_excluded_locales" ADD CONSTRAINT "pages_blocks_included_excluded_excluded_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_included_excluded_excluded"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_included_excluded" ADD CONSTRAINT "pages_blocks_included_excluded_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_block" ADD CONSTRAINT "pages_blocks_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_best_time_block_items" ADD CONSTRAINT "pages_blocks_best_time_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_best_time_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_best_time_block" ADD CONSTRAINT "pages_blocks_best_time_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_best_time_block_locales" ADD CONSTRAINT "pages_blocks_best_time_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_best_time_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block_questions" ADD CONSTRAINT "pages_blocks_faq_block_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block_questions_locales" ADD CONSTRAINT "pages_blocks_faq_block_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_block_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block" ADD CONSTRAINT "pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block_locales" ADD CONSTRAINT "pages_blocks_faq_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_hubs_block_links" ADD CONSTRAINT "pages_blocks_link_hubs_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_link_hubs_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_hubs_block_links_locales" ADD CONSTRAINT "pages_blocks_link_hubs_block_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_link_hubs_block_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_hubs_block" ADD CONSTRAINT "pages_blocks_link_hubs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_hubs_block_locales" ADD CONSTRAINT "pages_blocks_link_hubs_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_link_hubs_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_title_block" ADD CONSTRAINT "pages_blocks_title_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_title_block_locales" ADD CONSTRAINT "pages_blocks_title_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_title_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_fact_chips_facts" ADD CONSTRAINT "pages_blocks_fact_chips_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_fact_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_fact_chips_facts_locales" ADD CONSTRAINT "pages_blocks_fact_chips_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_fact_chips_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_fact_chips" ADD CONSTRAINT "pages_blocks_fact_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sticky_tabs_tabs" ADD CONSTRAINT "pages_blocks_sticky_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_sticky_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sticky_tabs_tabs_locales" ADD CONSTRAINT "pages_blocks_sticky_tabs_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_sticky_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sticky_tabs" ADD CONSTRAINT "pages_blocks_sticky_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_itinerary_days_meals" ADD CONSTRAINT "pages_blocks_itinerary_days_meals_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_itinerary_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_itinerary_days" ADD CONSTRAINT "pages_blocks_itinerary_days_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_itinerary_days" ADD CONSTRAINT "pages_blocks_itinerary_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_itinerary_days_locales" ADD CONSTRAINT "pages_blocks_itinerary_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_itinerary_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_itinerary" ADD CONSTRAINT "pages_blocks_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_overview" ADD CONSTRAINT "pages_blocks_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_overview_locales" ADD CONSTRAINT "pages_blocks_overview_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accessibility_section" ADD CONSTRAINT "pages_blocks_accessibility_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accessibility_section_locales" ADD CONSTRAINT "pages_blocks_accessibility_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accessibility_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews_block" ADD CONSTRAINT "pages_blocks_reviews_block_reviews_id_tours_id_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews_block" ADD CONSTRAINT "pages_blocks_reviews_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews_block_locales" ADD CONSTRAINT "pages_blocks_reviews_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_reviews_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_card" ADD CONSTRAINT "pages_blocks_booking_card_reference_id_tours_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_card" ADD CONSTRAINT "pages_blocks_booking_card_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_card" ADD CONSTRAINT "pages_blocks_booking_card_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_card" ADD CONSTRAINT "pages_blocks_booking_card_joint_departure_id_joint_departures_id_fk" FOREIGN KEY ("joint_departure_id") REFERENCES "public"."joint_departures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_card" ADD CONSTRAINT "pages_blocks_booking_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_card_locales" ADD CONSTRAINT "pages_blocks_booking_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_similar_items" ADD CONSTRAINT "pages_blocks_similar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_similar_items_locales" ADD CONSTRAINT "pages_blocks_similar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_similar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_departure_list" ADD CONSTRAINT "pages_blocks_departure_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_offer_banner" ADD CONSTRAINT "pages_blocks_offer_banner_link_id_pages_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_offer_banner" ADD CONSTRAINT "pages_blocks_offer_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_author_box" ADD CONSTRAINT "pages_blocks_author_box_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_author_box" ADD CONSTRAINT "pages_blocks_author_box_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_author_box_locales" ADD CONSTRAINT "pages_blocks_author_box_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_author_box"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_group_discount_table_discounts" ADD CONSTRAINT "pages_blocks_group_discount_table_discounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_group_discount_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_group_discount_table_discounts_locales" ADD CONSTRAINT "pages_blocks_group_discount_table_discounts_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_group_discount_table_discounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_group_discount_table" ADD CONSTRAINT "pages_blocks_group_discount_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_it_works_steps" ADD CONSTRAINT "pages_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_it_works_steps_locales" ADD CONSTRAINT "pages_blocks_how_it_works_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_how_it_works_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_it_works" ADD CONSTRAINT "pages_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter_locales" ADD CONSTRAINT "pages_blocks_newsletter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_terms_faq" ADD CONSTRAINT "pages_blocks_terms_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_terms_faq_locales" ADD CONSTRAINT "pages_blocks_terms_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_terms_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band_locales" ADD CONSTRAINT "pages_blocks_cta_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_safety_items" ADD CONSTRAINT "pages_blocks_features_safety_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features_safety"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_safety_items_locales" ADD CONSTRAINT "pages_blocks_features_safety_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features_safety_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_safety" ADD CONSTRAINT "pages_blocks_features_safety_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_what_to_expect_items" ADD CONSTRAINT "pages_blocks_what_to_expect_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_what_to_expect"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_what_to_expect_items_locales" ADD CONSTRAINT "pages_blocks_what_to_expect_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_what_to_expect_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_what_to_expect" ADD CONSTRAINT "pages_blocks_what_to_expect_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_specs_table_specs" ADD CONSTRAINT "pages_blocks_specs_table_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_specs_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_specs_table_specs_locales" ADD CONSTRAINT "pages_blocks_specs_table_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_specs_table_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_specs_table" ADD CONSTRAINT "pages_blocks_specs_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tours_using_vehicle" ADD CONSTRAINT "pages_blocks_tours_using_vehicle_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tours_using_vehicle_locales" ADD CONSTRAINT "pages_blocks_tours_using_vehicle_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tours_using_vehicle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seat_map" ADD CONSTRAINT "pages_blocks_seat_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_seat_map_locales" ADD CONSTRAINT "pages_blocks_seat_map_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_seat_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_price_table_table_data_row" ADD CONSTRAINT "pages_blocks_price_table_table_data_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_table_table_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_price_table_table_data_row_locales" ADD CONSTRAINT "pages_blocks_price_table_table_data_row_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_table_table_data_row"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_price_table_table_data" ADD CONSTRAINT "pages_blocks_price_table_table_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_price_table" ADD CONSTRAINT "pages_blocks_price_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_price_matrix" ADD CONSTRAINT "pages_blocks_price_matrix_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_policy_block" ADD CONSTRAINT "pages_blocks_policy_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_policy_block_locales" ADD CONSTRAINT "pages_blocks_policy_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_policy_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles_categories" ADD CONSTRAINT "pages_blocks_category_tiles_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles_categories" ADD CONSTRAINT "pages_blocks_category_tiles_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles_categories_locales" ADD CONSTRAINT "pages_blocks_category_tiles_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_tiles_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles" ADD CONSTRAINT "pages_blocks_category_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles_locales" ADD CONSTRAINT "pages_blocks_category_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_tours" ADD CONSTRAINT "pages_blocks_featured_tours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_tours_locales" ADD CONSTRAINT "pages_blocks_featured_tours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_featured_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_destination_tiles_destinations" ADD CONSTRAINT "pages_blocks_destination_tiles_destinations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_destination_tiles_destinations" ADD CONSTRAINT "pages_blocks_destination_tiles_destinations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_destination_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_destination_tiles_destinations_locales" ADD CONSTRAINT "pages_blocks_destination_tiles_destinations_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_destination_tiles_destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_destination_tiles" ADD CONSTRAINT "pages_blocks_destination_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_destination_tiles_locales" ADD CONSTRAINT "pages_blocks_destination_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_destination_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_feed_posts" ADD CONSTRAINT "pages_blocks_social_feed_posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_feed_posts" ADD CONSTRAINT "pages_blocks_social_feed_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_feed" ADD CONSTRAINT "pages_blocks_social_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_feed_locales" ADD CONSTRAINT "pages_blocks_social_feed_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_slides" ADD CONSTRAINT "_pages_v_blocks_home_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_slides" ADD CONSTRAINT "_pages_v_blocks_home_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_slides_locales" ADD CONSTRAINT "_pages_v_blocks_home_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero" ADD CONSTRAINT "_pages_v_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trip_finder" ADD CONSTRAINT "_pages_v_blocks_trip_finder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ways_to_travel_tiles" ADD CONSTRAINT "_pages_v_blocks_ways_to_travel_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ways_to_travel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ways_to_travel_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_ways_to_travel_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ways_to_travel_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ways_to_travel" ADD CONSTRAINT "_pages_v_blocks_ways_to_travel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ways_to_travel_locales" ADD CONSTRAINT "_pages_v_blocks_ways_to_travel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ways_to_travel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tours_rail" ADD CONSTRAINT "_pages_v_blocks_tours_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tours_rail_locales" ADD CONSTRAINT "_pages_v_blocks_tours_rail_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tours_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_departures_band" ADD CONSTRAINT "_pages_v_blocks_departures_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_departures_band_locales" ADD CONSTRAINT "_pages_v_blocks_departures_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_departures_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offers_rail" ADD CONSTRAINT "_pages_v_blocks_offers_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offers_rail_locales" ADD CONSTRAINT "_pages_v_blocks_offers_rail_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_offers_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_destinations_rail" ADD CONSTRAINT "_pages_v_blocks_destinations_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_destinations_rail_locales" ADD CONSTRAINT "_pages_v_blocks_destinations_rail_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_destinations_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_props_items" ADD CONSTRAINT "_pages_v_blocks_value_props_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_props"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_props_items_locales" ADD CONSTRAINT "_pages_v_blocks_value_props_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_props_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_props" ADD CONSTRAINT "_pages_v_blocks_value_props_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_props_locales" ADD CONSTRAINT "_pages_v_blocks_value_props_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_props"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner_locales" ADD CONSTRAINT "_pages_v_blocks_cta_banner_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog_rail" ADD CONSTRAINT "_pages_v_blocks_blog_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog_rail_locales" ADD CONSTRAINT "_pages_v_blocks_blog_rail_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_blog_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header_locales" ADD CONSTRAINT "_pages_v_blocks_page_header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_section" ADD CONSTRAINT "_pages_v_blocks_rich_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_section" ADD CONSTRAINT "_pages_v_blocks_rich_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_section_locales" ADD CONSTRAINT "_pages_v_blocks_rich_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_strip_items" ADD CONSTRAINT "_pages_v_blocks_stats_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_strip_items_locales" ADD CONSTRAINT "_pages_v_blocks_stats_strip_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_strip_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_strip" ADD CONSTRAINT "_pages_v_blocks_stats_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_section_items" ADD CONSTRAINT "_pages_v_blocks_faq_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_section_items_locales" ADD CONSTRAINT "_pages_v_blocks_faq_section_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_section_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_section" ADD CONSTRAINT "_pages_v_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_section_locales" ADD CONSTRAINT "_pages_v_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_section" ADD CONSTRAINT "_pages_v_blocks_contact_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_section_locales" ADD CONSTRAINT "_pages_v_blocks_contact_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_vehicle_grid" ADD CONSTRAINT "_pages_v_blocks_vehicle_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_vehicle_grid_locales" ADD CONSTRAINT "_pages_v_blocks_vehicle_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_vehicle_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_gallery" ADD CONSTRAINT "_pages_v_blocks_media_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_gallery_locales" ADD CONSTRAINT "_pages_v_blocks_media_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hotels_block_hotels" ADD CONSTRAINT "_pages_v_blocks_hotels_block_hotels_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hotels_block_hotels" ADD CONSTRAINT "_pages_v_blocks_hotels_block_hotels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hotels_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hotels_block_hotels_locales" ADD CONSTRAINT "_pages_v_blocks_hotels_block_hotels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hotels_block_hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hotels_block" ADD CONSTRAINT "_pages_v_blocks_hotels_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_included_excluded_included" ADD CONSTRAINT "_pages_v_blocks_included_excluded_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_included_excluded"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_included_excluded_included_locales" ADD CONSTRAINT "_pages_v_blocks_included_excluded_included_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_included_excluded_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_included_excluded_excluded" ADD CONSTRAINT "_pages_v_blocks_included_excluded_excluded_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_included_excluded"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_included_excluded_excluded_locales" ADD CONSTRAINT "_pages_v_blocks_included_excluded_excluded_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_included_excluded_excluded"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_included_excluded" ADD CONSTRAINT "_pages_v_blocks_included_excluded_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_block" ADD CONSTRAINT "_pages_v_blocks_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_best_time_block_items" ADD CONSTRAINT "_pages_v_blocks_best_time_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_best_time_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_best_time_block" ADD CONSTRAINT "_pages_v_blocks_best_time_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_best_time_block_locales" ADD CONSTRAINT "_pages_v_blocks_best_time_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_best_time_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block_questions" ADD CONSTRAINT "_pages_v_blocks_faq_block_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block_questions_locales" ADD CONSTRAINT "_pages_v_blocks_faq_block_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_block_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block" ADD CONSTRAINT "_pages_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_block_locales" ADD CONSTRAINT "_pages_v_blocks_faq_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_hubs_block_links" ADD CONSTRAINT "_pages_v_blocks_link_hubs_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_link_hubs_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_hubs_block_links_locales" ADD CONSTRAINT "_pages_v_blocks_link_hubs_block_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_link_hubs_block_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_hubs_block" ADD CONSTRAINT "_pages_v_blocks_link_hubs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_hubs_block_locales" ADD CONSTRAINT "_pages_v_blocks_link_hubs_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_link_hubs_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_title_block" ADD CONSTRAINT "_pages_v_blocks_title_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_title_block_locales" ADD CONSTRAINT "_pages_v_blocks_title_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_title_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fact_chips_facts" ADD CONSTRAINT "_pages_v_blocks_fact_chips_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_fact_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fact_chips_facts_locales" ADD CONSTRAINT "_pages_v_blocks_fact_chips_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_fact_chips_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fact_chips" ADD CONSTRAINT "_pages_v_blocks_fact_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sticky_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_sticky_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_sticky_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sticky_tabs_tabs_locales" ADD CONSTRAINT "_pages_v_blocks_sticky_tabs_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_sticky_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sticky_tabs" ADD CONSTRAINT "_pages_v_blocks_sticky_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_itinerary_days_meals" ADD CONSTRAINT "_pages_v_blocks_itinerary_days_meals_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_itinerary_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_itinerary_days" ADD CONSTRAINT "_pages_v_blocks_itinerary_days_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_itinerary_days" ADD CONSTRAINT "_pages_v_blocks_itinerary_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_itinerary_days_locales" ADD CONSTRAINT "_pages_v_blocks_itinerary_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_itinerary_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_itinerary" ADD CONSTRAINT "_pages_v_blocks_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_overview" ADD CONSTRAINT "_pages_v_blocks_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_overview_locales" ADD CONSTRAINT "_pages_v_blocks_overview_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_overview"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accessibility_section" ADD CONSTRAINT "_pages_v_blocks_accessibility_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accessibility_section_locales" ADD CONSTRAINT "_pages_v_blocks_accessibility_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accessibility_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_reviews_block" ADD CONSTRAINT "_pages_v_blocks_reviews_block_reviews_id_tours_id_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_reviews_block" ADD CONSTRAINT "_pages_v_blocks_reviews_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_reviews_block_locales" ADD CONSTRAINT "_pages_v_blocks_reviews_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_reviews_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_card" ADD CONSTRAINT "_pages_v_blocks_booking_card_reference_id_tours_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_card" ADD CONSTRAINT "_pages_v_blocks_booking_card_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_card" ADD CONSTRAINT "_pages_v_blocks_booking_card_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_card" ADD CONSTRAINT "_pages_v_blocks_booking_card_joint_departure_id_joint_departures_id_fk" FOREIGN KEY ("joint_departure_id") REFERENCES "public"."joint_departures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_card" ADD CONSTRAINT "_pages_v_blocks_booking_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_card_locales" ADD CONSTRAINT "_pages_v_blocks_booking_card_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_booking_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_similar_items" ADD CONSTRAINT "_pages_v_blocks_similar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_similar_items_locales" ADD CONSTRAINT "_pages_v_blocks_similar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_similar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_departure_list" ADD CONSTRAINT "_pages_v_blocks_departure_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offer_banner" ADD CONSTRAINT "_pages_v_blocks_offer_banner_link_id_pages_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offer_banner" ADD CONSTRAINT "_pages_v_blocks_offer_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_author_box" ADD CONSTRAINT "_pages_v_blocks_author_box_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_author_box" ADD CONSTRAINT "_pages_v_blocks_author_box_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_author_box_locales" ADD CONSTRAINT "_pages_v_blocks_author_box_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_author_box"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_group_discount_table_discounts" ADD CONSTRAINT "_pages_v_blocks_group_discount_table_discounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_group_discount_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_group_discount_table_discounts_locales" ADD CONSTRAINT "_pages_v_blocks_group_discount_table_discounts_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_group_discount_table_discounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_group_discount_table" ADD CONSTRAINT "_pages_v_blocks_group_discount_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_it_works_steps" ADD CONSTRAINT "_pages_v_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_it_works_steps_locales" ADD CONSTRAINT "_pages_v_blocks_how_it_works_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_how_it_works_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_it_works" ADD CONSTRAINT "_pages_v_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter_locales" ADD CONSTRAINT "_pages_v_blocks_newsletter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_terms_faq" ADD CONSTRAINT "_pages_v_blocks_terms_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_terms_faq_locales" ADD CONSTRAINT "_pages_v_blocks_terms_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_terms_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band_locales" ADD CONSTRAINT "_pages_v_blocks_cta_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_safety_items" ADD CONSTRAINT "_pages_v_blocks_features_safety_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features_safety"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_safety_items_locales" ADD CONSTRAINT "_pages_v_blocks_features_safety_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features_safety_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_safety" ADD CONSTRAINT "_pages_v_blocks_features_safety_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_what_to_expect_items" ADD CONSTRAINT "_pages_v_blocks_what_to_expect_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_what_to_expect"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_what_to_expect_items_locales" ADD CONSTRAINT "_pages_v_blocks_what_to_expect_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_what_to_expect_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_what_to_expect" ADD CONSTRAINT "_pages_v_blocks_what_to_expect_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_specs_table_specs" ADD CONSTRAINT "_pages_v_blocks_specs_table_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_specs_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_specs_table_specs_locales" ADD CONSTRAINT "_pages_v_blocks_specs_table_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_specs_table_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_specs_table" ADD CONSTRAINT "_pages_v_blocks_specs_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tours_using_vehicle" ADD CONSTRAINT "_pages_v_blocks_tours_using_vehicle_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tours_using_vehicle_locales" ADD CONSTRAINT "_pages_v_blocks_tours_using_vehicle_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tours_using_vehicle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seat_map" ADD CONSTRAINT "_pages_v_blocks_seat_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_seat_map_locales" ADD CONSTRAINT "_pages_v_blocks_seat_map_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_seat_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_price_table_table_data_row" ADD CONSTRAINT "_pages_v_blocks_price_table_table_data_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_table_table_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_price_table_table_data_row_locales" ADD CONSTRAINT "_pages_v_blocks_price_table_table_data_row_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_table_table_data_row"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_price_table_table_data" ADD CONSTRAINT "_pages_v_blocks_price_table_table_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_price_table" ADD CONSTRAINT "_pages_v_blocks_price_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_price_matrix" ADD CONSTRAINT "_pages_v_blocks_price_matrix_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_policy_block" ADD CONSTRAINT "_pages_v_blocks_policy_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_policy_block_locales" ADD CONSTRAINT "_pages_v_blocks_policy_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_policy_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles_categories" ADD CONSTRAINT "_pages_v_blocks_category_tiles_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles_categories" ADD CONSTRAINT "_pages_v_blocks_category_tiles_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles_categories_locales" ADD CONSTRAINT "_pages_v_blocks_category_tiles_categories_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_tiles_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles" ADD CONSTRAINT "_pages_v_blocks_category_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_category_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_tours" ADD CONSTRAINT "_pages_v_blocks_featured_tours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_tours_locales" ADD CONSTRAINT "_pages_v_blocks_featured_tours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_featured_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_destination_tiles_destinations" ADD CONSTRAINT "_pages_v_blocks_destination_tiles_destinations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_destination_tiles_destinations" ADD CONSTRAINT "_pages_v_blocks_destination_tiles_destinations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_destination_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_destination_tiles_destinations_locales" ADD CONSTRAINT "_pages_v_blocks_destination_tiles_destinations_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_destination_tiles_destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_destination_tiles" ADD CONSTRAINT "_pages_v_blocks_destination_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_destination_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_destination_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_destination_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_feed_posts" ADD CONSTRAINT "_pages_v_blocks_social_feed_posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_feed_posts" ADD CONSTRAINT "_pages_v_blocks_social_feed_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_social_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_feed" ADD CONSTRAINT "_pages_v_blocks_social_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_feed_locales" ADD CONSTRAINT "_pages_v_blocks_social_feed_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_social_feed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_highlights" ADD CONSTRAINT "tours_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_highlights_locales" ADD CONSTRAINT "tours_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_itinerary_meals" ADD CONSTRAINT "tours_itinerary_meals_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_itinerary" ADD CONSTRAINT "tours_itinerary_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_itinerary" ADD CONSTRAINT "tours_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_itinerary_locales" ADD CONSTRAINT "tours_itinerary_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_included" ADD CONSTRAINT "tours_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_included_locales" ADD CONSTRAINT "tours_included_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_included"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_excluded" ADD CONSTRAINT "tours_excluded_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_excluded_locales" ADD CONSTRAINT "tours_excluded_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_excluded"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_pricing_matrix" ADD CONSTRAINT "tours_pricing_matrix_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_pricing_matrix" ADD CONSTRAINT "tours_pricing_matrix_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_gallery" ADD CONSTRAINT "tours_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_gallery" ADD CONSTRAINT "tours_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_gallery_locales" ADD CONSTRAINT "tours_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_videos" ADD CONSTRAINT "tours_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_videos_locales" ADD CONSTRAINT "tours_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_accessibility_features" ADD CONSTRAINT "tours_accessibility_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_accessibility_features_locales" ADD CONSTRAINT "tours_accessibility_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_accessibility_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_best_time" ADD CONSTRAINT "tours_best_time_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_best_time_locales" ADD CONSTRAINT "tours_best_time_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_best_time"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_faq" ADD CONSTRAINT "tours_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_faq_locales" ADD CONSTRAINT "tours_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_itinerary_pdf_id_media_id_fk" FOREIGN KEY ("itinerary_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_accessibility_vehicle_id_vehicles_id_fk" FOREIGN KEY ("accessibility_vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_locales" ADD CONSTRAINT "tours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_gallery" ADD CONSTRAINT "vehicles_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vehicles_gallery" ADD CONSTRAINT "vehicles_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_features" ADD CONSTRAINT "vehicles_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_features_locales" ADD CONSTRAINT "vehicles_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_specs" ADD CONSTRAINT "vehicles_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_specs_locales" ADD CONSTRAINT "vehicles_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_rates" ADD CONSTRAINT "vehicles_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_rates_locales" ADD CONSTRAINT "vehicles_rates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles_rates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vehicles_locales" ADD CONSTRAINT "vehicles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seasons_locales" ADD CONSTRAINT "seasons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_how_it_works" ADD CONSTRAINT "offers_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_how_it_works_locales" ADD CONSTRAINT "offers_how_it_works_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers_locales" ADD CONSTRAINT "offers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_rels" ADD CONSTRAINT "offers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_rels" ADD CONSTRAINT "offers_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hotels" ADD CONSTRAINT "hotels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hotels_locales" ADD CONSTRAINT "hotels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "joint_departures" ADD CONSTRAINT "joint_departures_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "joint_departures" ADD CONSTRAINT "joint_departures_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "joint_departures_locales" ADD CONSTRAINT "joint_departures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."joint_departures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_locales" ADD CONSTRAINT "destinations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_sections" ADD CONSTRAINT "templates_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_sections_locales" ADD CONSTRAINT "templates_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_tabs" ADD CONSTRAINT "templates_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "templates_tabs_locales" ADD CONSTRAINT "templates_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items_locales" ADD CONSTRAINT "gallery_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_departure_id_joint_departures_id_fk" FOREIGN KEY ("departure_id") REFERENCES "public"."joint_departures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vehicles_fk" FOREIGN KEY ("vehicles_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seasons_fk" FOREIGN KEY ("seasons_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offers_fk" FOREIGN KEY ("offers_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hotels_fk" FOREIGN KEY ("hotels_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_joint_departures_fk" FOREIGN KEY ("joint_departures_id") REFERENCES "public"."joint_departures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_templates_fk" FOREIGN KEY ("templates_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_items_fk" FOREIGN KEY ("gallery_items_id") REFERENCES "public"."gallery_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_items_children" ADD CONSTRAINT "header_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_items_children_locales" ADD CONSTRAINT "header_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_items" ADD CONSTRAINT "header_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_items_locales" ADD CONSTRAINT "header_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links_locales" ADD CONSTRAINT "footer_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_trust" ADD CONSTRAINT "site_settings_trust_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_trust_locales" ADD CONSTRAINT "site_settings_trust_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_trust"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_payment_methods" ADD CONSTRAINT "site_settings_payment_methods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_currencies" ADD CONSTRAINT "site_settings_currencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_default_og_image_id_media_id_fk" FOREIGN KEY ("seo_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_credentials" ADD CONSTRAINT "company_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_credentials_locales" ADD CONSTRAINT "company_credentials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_credentials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company" ADD CONSTRAINT "company_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_locales" ADD CONSTRAINT "company_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "routes_routes" ADD CONSTRAINT "routes_routes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "routes_routes_locales" ADD CONSTRAINT "routes_routes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."routes_routes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_entries" ADD CONSTRAINT "translations_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "translations_entries_locales" ADD CONSTRAINT "translations_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."translations_entries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_slides_order_idx" ON "pages_blocks_home_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_slides_parent_id_idx" ON "pages_blocks_home_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_slides_image_idx" ON "pages_blocks_home_hero_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_home_hero_slides_locales_locale_parent_id_uniqu" ON "pages_blocks_home_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_home_hero_order_idx" ON "pages_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_parent_id_idx" ON "pages_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_path_idx" ON "pages_blocks_home_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_trip_finder_order_idx" ON "pages_blocks_trip_finder" USING btree ("_order");
  CREATE INDEX "pages_blocks_trip_finder_parent_id_idx" ON "pages_blocks_trip_finder" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trip_finder_path_idx" ON "pages_blocks_trip_finder" USING btree ("_path");
  CREATE INDEX "pages_blocks_ways_to_travel_tiles_order_idx" ON "pages_blocks_ways_to_travel_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_ways_to_travel_tiles_parent_id_idx" ON "pages_blocks_ways_to_travel_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_ways_to_travel_tiles_locales_locale_parent_id_u" ON "pages_blocks_ways_to_travel_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_ways_to_travel_order_idx" ON "pages_blocks_ways_to_travel" USING btree ("_order");
  CREATE INDEX "pages_blocks_ways_to_travel_parent_id_idx" ON "pages_blocks_ways_to_travel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ways_to_travel_path_idx" ON "pages_blocks_ways_to_travel" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_ways_to_travel_locales_locale_parent_id_unique" ON "pages_blocks_ways_to_travel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_tours_rail_order_idx" ON "pages_blocks_tours_rail" USING btree ("_order");
  CREATE INDEX "pages_blocks_tours_rail_parent_id_idx" ON "pages_blocks_tours_rail" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tours_rail_path_idx" ON "pages_blocks_tours_rail" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_tours_rail_locales_locale_parent_id_unique" ON "pages_blocks_tours_rail_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_departures_band_order_idx" ON "pages_blocks_departures_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_departures_band_parent_id_idx" ON "pages_blocks_departures_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_departures_band_path_idx" ON "pages_blocks_departures_band" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_departures_band_locales_locale_parent_id_unique" ON "pages_blocks_departures_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_offers_rail_order_idx" ON "pages_blocks_offers_rail" USING btree ("_order");
  CREATE INDEX "pages_blocks_offers_rail_parent_id_idx" ON "pages_blocks_offers_rail" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_offers_rail_path_idx" ON "pages_blocks_offers_rail" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_offers_rail_locales_locale_parent_id_unique" ON "pages_blocks_offers_rail_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_destinations_rail_order_idx" ON "pages_blocks_destinations_rail" USING btree ("_order");
  CREATE INDEX "pages_blocks_destinations_rail_parent_id_idx" ON "pages_blocks_destinations_rail" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_destinations_rail_path_idx" ON "pages_blocks_destinations_rail" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_destinations_rail_locales_locale_parent_id_uniq" ON "pages_blocks_destinations_rail_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_value_props_items_order_idx" ON "pages_blocks_value_props_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_value_props_items_parent_id_idx" ON "pages_blocks_value_props_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_value_props_items_locales_locale_parent_id_uniq" ON "pages_blocks_value_props_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_value_props_order_idx" ON "pages_blocks_value_props" USING btree ("_order");
  CREATE INDEX "pages_blocks_value_props_parent_id_idx" ON "pages_blocks_value_props" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_value_props_path_idx" ON "pages_blocks_value_props" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_value_props_locales_locale_parent_id_unique" ON "pages_blocks_value_props_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_order_idx" ON "pages_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_parent_id_idx" ON "pages_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_path_idx" ON "pages_blocks_cta_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_banner_locales_locale_parent_id_unique" ON "pages_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_blog_rail_order_idx" ON "pages_blocks_blog_rail" USING btree ("_order");
  CREATE INDEX "pages_blocks_blog_rail_parent_id_idx" ON "pages_blocks_blog_rail" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blog_rail_path_idx" ON "pages_blocks_blog_rail" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_blog_rail_locales_locale_parent_id_unique" ON "pages_blocks_blog_rail_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_page_header_order_idx" ON "pages_blocks_page_header" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_header_parent_id_idx" ON "pages_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_header_path_idx" ON "pages_blocks_page_header" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_header_image_idx" ON "pages_blocks_page_header" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_page_header_locales_locale_parent_id_unique" ON "pages_blocks_page_header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_rich_section_order_idx" ON "pages_blocks_rich_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_section_parent_id_idx" ON "pages_blocks_rich_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_section_path_idx" ON "pages_blocks_rich_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_section_image_idx" ON "pages_blocks_rich_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_rich_section_locales_locale_parent_id_unique" ON "pages_blocks_rich_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_strip_items_order_idx" ON "pages_blocks_stats_strip_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_strip_items_parent_id_idx" ON "pages_blocks_stats_strip_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_strip_items_locales_locale_parent_id_uniq" ON "pages_blocks_stats_strip_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_strip_order_idx" ON "pages_blocks_stats_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_strip_parent_id_idx" ON "pages_blocks_stats_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_strip_path_idx" ON "pages_blocks_stats_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_section_items_order_idx" ON "pages_blocks_faq_section_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_section_items_parent_id_idx" ON "pages_blocks_faq_section_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_section_items_locales_locale_parent_id_uniq" ON "pages_blocks_faq_section_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_section_order_idx" ON "pages_blocks_faq_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_section_parent_id_idx" ON "pages_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_section_path_idx" ON "pages_blocks_faq_section" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_section_locales_locale_parent_id_unique" ON "pages_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_contact_section_order_idx" ON "pages_blocks_contact_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_section_parent_id_idx" ON "pages_blocks_contact_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_section_path_idx" ON "pages_blocks_contact_section" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_contact_section_locales_locale_parent_id_unique" ON "pages_blocks_contact_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_vehicle_grid_order_idx" ON "pages_blocks_vehicle_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_vehicle_grid_parent_id_idx" ON "pages_blocks_vehicle_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_vehicle_grid_path_idx" ON "pages_blocks_vehicle_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_vehicle_grid_locales_locale_parent_id_unique" ON "pages_blocks_vehicle_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_media_gallery_order_idx" ON "pages_blocks_media_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_gallery_parent_id_idx" ON "pages_blocks_media_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_gallery_path_idx" ON "pages_blocks_media_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_media_gallery_locales_locale_parent_id_unique" ON "pages_blocks_media_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_blocks_hotels_block_hotels_order_idx" ON "pages_blocks_hotels_block_hotels" USING btree ("_order");
  CREATE INDEX "pages_blocks_hotels_block_hotels_parent_id_idx" ON "pages_blocks_hotels_block_hotels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hotels_block_hotels_hotel_idx" ON "pages_blocks_hotels_block_hotels" USING btree ("hotel_id");
  CREATE UNIQUE INDEX "pages_blocks_hotels_block_hotels_locales_locale_parent_id_un" ON "pages_blocks_hotels_block_hotels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hotels_block_order_idx" ON "pages_blocks_hotels_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_hotels_block_parent_id_idx" ON "pages_blocks_hotels_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hotels_block_path_idx" ON "pages_blocks_hotels_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_included_excluded_included_order_idx" ON "pages_blocks_included_excluded_included" USING btree ("_order");
  CREATE INDEX "pages_blocks_included_excluded_included_parent_id_idx" ON "pages_blocks_included_excluded_included" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_included_excluded_included_locales_locale_paren" ON "pages_blocks_included_excluded_included_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_included_excluded_excluded_order_idx" ON "pages_blocks_included_excluded_excluded" USING btree ("_order");
  CREATE INDEX "pages_blocks_included_excluded_excluded_parent_id_idx" ON "pages_blocks_included_excluded_excluded" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_included_excluded_excluded_locales_locale_paren" ON "pages_blocks_included_excluded_excluded_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_included_excluded_order_idx" ON "pages_blocks_included_excluded" USING btree ("_order");
  CREATE INDEX "pages_blocks_included_excluded_parent_id_idx" ON "pages_blocks_included_excluded" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_included_excluded_path_idx" ON "pages_blocks_included_excluded" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_block_order_idx" ON "pages_blocks_video_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_block_parent_id_idx" ON "pages_blocks_video_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_block_path_idx" ON "pages_blocks_video_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_best_time_block_items_order_idx" ON "pages_blocks_best_time_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_best_time_block_items_parent_id_idx" ON "pages_blocks_best_time_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_best_time_block_items_locale_idx" ON "pages_blocks_best_time_block_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_best_time_block_order_idx" ON "pages_blocks_best_time_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_best_time_block_parent_id_idx" ON "pages_blocks_best_time_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_best_time_block_path_idx" ON "pages_blocks_best_time_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_best_time_block_locales_locale_parent_id_unique" ON "pages_blocks_best_time_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_block_questions_order_idx" ON "pages_blocks_faq_block_questions" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_block_questions_parent_id_idx" ON "pages_blocks_faq_block_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_block_questions_locales_locale_parent_id_un" ON "pages_blocks_faq_block_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_block_order_idx" ON "pages_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_block_parent_id_idx" ON "pages_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_block_path_idx" ON "pages_blocks_faq_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_block_locales_locale_parent_id_unique" ON "pages_blocks_faq_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_link_hubs_block_links_order_idx" ON "pages_blocks_link_hubs_block_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_hubs_block_links_parent_id_idx" ON "pages_blocks_link_hubs_block_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_link_hubs_block_links_locales_locale_parent_id_" ON "pages_blocks_link_hubs_block_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_link_hubs_block_order_idx" ON "pages_blocks_link_hubs_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_hubs_block_parent_id_idx" ON "pages_blocks_link_hubs_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_hubs_block_path_idx" ON "pages_blocks_link_hubs_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_link_hubs_block_locales_locale_parent_id_unique" ON "pages_blocks_link_hubs_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_title_block_order_idx" ON "pages_blocks_title_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_title_block_parent_id_idx" ON "pages_blocks_title_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_title_block_path_idx" ON "pages_blocks_title_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_title_block_locales_locale_parent_id_unique" ON "pages_blocks_title_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_fact_chips_facts_order_idx" ON "pages_blocks_fact_chips_facts" USING btree ("_order");
  CREATE INDEX "pages_blocks_fact_chips_facts_parent_id_idx" ON "pages_blocks_fact_chips_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_fact_chips_facts_locales_locale_parent_id_uniqu" ON "pages_blocks_fact_chips_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_fact_chips_order_idx" ON "pages_blocks_fact_chips" USING btree ("_order");
  CREATE INDEX "pages_blocks_fact_chips_parent_id_idx" ON "pages_blocks_fact_chips" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_fact_chips_path_idx" ON "pages_blocks_fact_chips" USING btree ("_path");
  CREATE INDEX "pages_blocks_sticky_tabs_tabs_order_idx" ON "pages_blocks_sticky_tabs_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_sticky_tabs_tabs_parent_id_idx" ON "pages_blocks_sticky_tabs_tabs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_sticky_tabs_tabs_locales_locale_parent_id_uniqu" ON "pages_blocks_sticky_tabs_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_sticky_tabs_order_idx" ON "pages_blocks_sticky_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_sticky_tabs_parent_id_idx" ON "pages_blocks_sticky_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sticky_tabs_path_idx" ON "pages_blocks_sticky_tabs" USING btree ("_path");
  CREATE INDEX "pages_blocks_itinerary_days_meals_order_idx" ON "pages_blocks_itinerary_days_meals" USING btree ("order");
  CREATE INDEX "pages_blocks_itinerary_days_meals_parent_idx" ON "pages_blocks_itinerary_days_meals" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_itinerary_days_order_idx" ON "pages_blocks_itinerary_days" USING btree ("_order");
  CREATE INDEX "pages_blocks_itinerary_days_parent_id_idx" ON "pages_blocks_itinerary_days" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_itinerary_days_hotel_idx" ON "pages_blocks_itinerary_days" USING btree ("hotel_id");
  CREATE UNIQUE INDEX "pages_blocks_itinerary_days_locales_locale_parent_id_unique" ON "pages_blocks_itinerary_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_itinerary_order_idx" ON "pages_blocks_itinerary" USING btree ("_order");
  CREATE INDEX "pages_blocks_itinerary_parent_id_idx" ON "pages_blocks_itinerary" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_itinerary_path_idx" ON "pages_blocks_itinerary" USING btree ("_path");
  CREATE INDEX "pages_blocks_overview_order_idx" ON "pages_blocks_overview" USING btree ("_order");
  CREATE INDEX "pages_blocks_overview_parent_id_idx" ON "pages_blocks_overview" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_overview_path_idx" ON "pages_blocks_overview" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_overview_locales_locale_parent_id_unique" ON "pages_blocks_overview_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_accessibility_section_order_idx" ON "pages_blocks_accessibility_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_accessibility_section_parent_id_idx" ON "pages_blocks_accessibility_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accessibility_section_path_idx" ON "pages_blocks_accessibility_section" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_accessibility_section_locales_locale_parent_id_" ON "pages_blocks_accessibility_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_reviews_block_order_idx" ON "pages_blocks_reviews_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_reviews_block_parent_id_idx" ON "pages_blocks_reviews_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reviews_block_path_idx" ON "pages_blocks_reviews_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_reviews_block_reviews_idx" ON "pages_blocks_reviews_block" USING btree ("reviews_id");
  CREATE UNIQUE INDEX "pages_blocks_reviews_block_locales_locale_parent_id_unique" ON "pages_blocks_reviews_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_booking_card_order_idx" ON "pages_blocks_booking_card" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_card_parent_id_idx" ON "pages_blocks_booking_card" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_booking_card_path_idx" ON "pages_blocks_booking_card" USING btree ("_path");
  CREATE INDEX "pages_blocks_booking_card_reference_idx" ON "pages_blocks_booking_card" USING btree ("reference_id");
  CREATE INDEX "pages_blocks_booking_card_tour_idx" ON "pages_blocks_booking_card" USING btree ("tour_id");
  CREATE INDEX "pages_blocks_booking_card_vehicle_idx" ON "pages_blocks_booking_card" USING btree ("vehicle_id");
  CREATE INDEX "pages_blocks_booking_card_joint_departure_idx" ON "pages_blocks_booking_card" USING btree ("joint_departure_id");
  CREATE UNIQUE INDEX "pages_blocks_booking_card_locales_locale_parent_id_unique" ON "pages_blocks_booking_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_similar_items_order_idx" ON "pages_blocks_similar_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_similar_items_parent_id_idx" ON "pages_blocks_similar_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_similar_items_path_idx" ON "pages_blocks_similar_items" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_similar_items_locales_locale_parent_id_unique" ON "pages_blocks_similar_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_departure_list_order_idx" ON "pages_blocks_departure_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_departure_list_parent_id_idx" ON "pages_blocks_departure_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_departure_list_path_idx" ON "pages_blocks_departure_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_offer_banner_order_idx" ON "pages_blocks_offer_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_offer_banner_parent_id_idx" ON "pages_blocks_offer_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_offer_banner_path_idx" ON "pages_blocks_offer_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_offer_banner_link_idx" ON "pages_blocks_offer_banner" USING btree ("link_id");
  CREATE INDEX "pages_blocks_author_box_order_idx" ON "pages_blocks_author_box" USING btree ("_order");
  CREATE INDEX "pages_blocks_author_box_parent_id_idx" ON "pages_blocks_author_box" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_author_box_path_idx" ON "pages_blocks_author_box" USING btree ("_path");
  CREATE INDEX "pages_blocks_author_box_author_idx" ON "pages_blocks_author_box" USING btree ("author_id");
  CREATE UNIQUE INDEX "pages_blocks_author_box_locales_locale_parent_id_unique" ON "pages_blocks_author_box_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_group_discount_table_discounts_order_idx" ON "pages_blocks_group_discount_table_discounts" USING btree ("_order");
  CREATE INDEX "pages_blocks_group_discount_table_discounts_parent_id_idx" ON "pages_blocks_group_discount_table_discounts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_group_discount_table_discounts_locales_locale_p" ON "pages_blocks_group_discount_table_discounts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_group_discount_table_order_idx" ON "pages_blocks_group_discount_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_group_discount_table_parent_id_idx" ON "pages_blocks_group_discount_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_group_discount_table_path_idx" ON "pages_blocks_group_discount_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_how_it_works_steps_order_idx" ON "pages_blocks_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_it_works_steps_parent_id_idx" ON "pages_blocks_how_it_works_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_how_it_works_steps_locales_locale_parent_id_uni" ON "pages_blocks_how_it_works_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_how_it_works_order_idx" ON "pages_blocks_how_it_works" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_it_works_parent_id_idx" ON "pages_blocks_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_how_it_works_path_idx" ON "pages_blocks_how_it_works" USING btree ("_path");
  CREATE INDEX "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_newsletter_locales_locale_parent_id_unique" ON "pages_blocks_newsletter_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_terms_faq_order_idx" ON "pages_blocks_terms_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_terms_faq_parent_id_idx" ON "pages_blocks_terms_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_terms_faq_path_idx" ON "pages_blocks_terms_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_terms_faq_locales_locale_parent_id_unique" ON "pages_blocks_terms_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_band_locales_locale_parent_id_unique" ON "pages_blocks_cta_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_features_safety_items_order_idx" ON "pages_blocks_features_safety_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_safety_items_parent_id_idx" ON "pages_blocks_features_safety_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_features_safety_items_locales_locale_parent_id_" ON "pages_blocks_features_safety_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_features_safety_order_idx" ON "pages_blocks_features_safety" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_safety_parent_id_idx" ON "pages_blocks_features_safety" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_safety_path_idx" ON "pages_blocks_features_safety" USING btree ("_path");
  CREATE INDEX "pages_blocks_what_to_expect_items_order_idx" ON "pages_blocks_what_to_expect_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_what_to_expect_items_parent_id_idx" ON "pages_blocks_what_to_expect_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_what_to_expect_items_locales_locale_parent_id_u" ON "pages_blocks_what_to_expect_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_what_to_expect_order_idx" ON "pages_blocks_what_to_expect" USING btree ("_order");
  CREATE INDEX "pages_blocks_what_to_expect_parent_id_idx" ON "pages_blocks_what_to_expect" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_what_to_expect_path_idx" ON "pages_blocks_what_to_expect" USING btree ("_path");
  CREATE INDEX "pages_blocks_specs_table_specs_order_idx" ON "pages_blocks_specs_table_specs" USING btree ("_order");
  CREATE INDEX "pages_blocks_specs_table_specs_parent_id_idx" ON "pages_blocks_specs_table_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_specs_table_specs_locales_locale_parent_id_uniq" ON "pages_blocks_specs_table_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_specs_table_order_idx" ON "pages_blocks_specs_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_specs_table_parent_id_idx" ON "pages_blocks_specs_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_specs_table_path_idx" ON "pages_blocks_specs_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_tours_using_vehicle_order_idx" ON "pages_blocks_tours_using_vehicle" USING btree ("_order");
  CREATE INDEX "pages_blocks_tours_using_vehicle_parent_id_idx" ON "pages_blocks_tours_using_vehicle" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tours_using_vehicle_path_idx" ON "pages_blocks_tours_using_vehicle" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_tours_using_vehicle_locales_locale_parent_id_un" ON "pages_blocks_tours_using_vehicle_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_seat_map_order_idx" ON "pages_blocks_seat_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_seat_map_parent_id_idx" ON "pages_blocks_seat_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_seat_map_path_idx" ON "pages_blocks_seat_map" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_seat_map_locales_locale_parent_id_unique" ON "pages_blocks_seat_map_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_price_table_table_data_row_order_idx" ON "pages_blocks_price_table_table_data_row" USING btree ("_order");
  CREATE INDEX "pages_blocks_price_table_table_data_row_parent_id_idx" ON "pages_blocks_price_table_table_data_row" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_price_table_table_data_row_locales_locale_paren" ON "pages_blocks_price_table_table_data_row_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_price_table_table_data_order_idx" ON "pages_blocks_price_table_table_data" USING btree ("_order");
  CREATE INDEX "pages_blocks_price_table_table_data_parent_id_idx" ON "pages_blocks_price_table_table_data" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_price_table_order_idx" ON "pages_blocks_price_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_price_table_parent_id_idx" ON "pages_blocks_price_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_price_table_path_idx" ON "pages_blocks_price_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_price_matrix_order_idx" ON "pages_blocks_price_matrix" USING btree ("_order");
  CREATE INDEX "pages_blocks_price_matrix_parent_id_idx" ON "pages_blocks_price_matrix" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_price_matrix_path_idx" ON "pages_blocks_price_matrix" USING btree ("_path");
  CREATE INDEX "pages_blocks_policy_block_order_idx" ON "pages_blocks_policy_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_policy_block_parent_id_idx" ON "pages_blocks_policy_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_policy_block_path_idx" ON "pages_blocks_policy_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_policy_block_locales_locale_parent_id_unique" ON "pages_blocks_policy_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_categories_order_idx" ON "pages_blocks_category_tiles_categories" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_tiles_categories_parent_id_idx" ON "pages_blocks_category_tiles_categories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_categories_image_idx" ON "pages_blocks_category_tiles_categories" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_category_tiles_categories_locales_locale_parent" ON "pages_blocks_category_tiles_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_order_idx" ON "pages_blocks_category_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_tiles_parent_id_idx" ON "pages_blocks_category_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_path_idx" ON "pages_blocks_category_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_category_tiles_locales_locale_parent_id_unique" ON "pages_blocks_category_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_featured_tours_order_idx" ON "pages_blocks_featured_tours" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_tours_parent_id_idx" ON "pages_blocks_featured_tours" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_tours_path_idx" ON "pages_blocks_featured_tours" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_featured_tours_locales_locale_parent_id_unique" ON "pages_blocks_featured_tours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_destination_tiles_destinations_order_idx" ON "pages_blocks_destination_tiles_destinations" USING btree ("_order");
  CREATE INDEX "pages_blocks_destination_tiles_destinations_parent_id_idx" ON "pages_blocks_destination_tiles_destinations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_destination_tiles_destinations_image_idx" ON "pages_blocks_destination_tiles_destinations" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_destination_tiles_destinations_locales_locale_p" ON "pages_blocks_destination_tiles_destinations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_destination_tiles_order_idx" ON "pages_blocks_destination_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_destination_tiles_parent_id_idx" ON "pages_blocks_destination_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_destination_tiles_path_idx" ON "pages_blocks_destination_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_destination_tiles_locales_locale_parent_id_uniq" ON "pages_blocks_destination_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_social_feed_posts_order_idx" ON "pages_blocks_social_feed_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_feed_posts_parent_id_idx" ON "pages_blocks_social_feed_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_feed_posts_image_idx" ON "pages_blocks_social_feed_posts" USING btree ("image_id");
  CREATE INDEX "pages_blocks_social_feed_order_idx" ON "pages_blocks_social_feed" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_feed_parent_id_idx" ON "pages_blocks_social_feed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_feed_path_idx" ON "pages_blocks_social_feed" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_social_feed_locales_locale_parent_id_unique" ON "pages_blocks_social_feed_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_tours_id_idx" ON "pages_rels" USING btree ("tours_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_slides_order_idx" ON "_pages_v_blocks_home_hero_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_slides_parent_id_idx" ON "_pages_v_blocks_home_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_slides_image_idx" ON "_pages_v_blocks_home_hero_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_home_hero_slides_locales_locale_parent_id_un" ON "_pages_v_blocks_home_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_order_idx" ON "_pages_v_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_parent_id_idx" ON "_pages_v_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_path_idx" ON "_pages_v_blocks_home_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_trip_finder_order_idx" ON "_pages_v_blocks_trip_finder" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trip_finder_parent_id_idx" ON "_pages_v_blocks_trip_finder" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trip_finder_path_idx" ON "_pages_v_blocks_trip_finder" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_ways_to_travel_tiles_order_idx" ON "_pages_v_blocks_ways_to_travel_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_ways_to_travel_tiles_parent_id_idx" ON "_pages_v_blocks_ways_to_travel_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_ways_to_travel_tiles_locales_locale_parent_i" ON "_pages_v_blocks_ways_to_travel_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_ways_to_travel_order_idx" ON "_pages_v_blocks_ways_to_travel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_ways_to_travel_parent_id_idx" ON "_pages_v_blocks_ways_to_travel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_ways_to_travel_path_idx" ON "_pages_v_blocks_ways_to_travel" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_ways_to_travel_locales_locale_parent_id_uniq" ON "_pages_v_blocks_ways_to_travel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_tours_rail_order_idx" ON "_pages_v_blocks_tours_rail" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tours_rail_parent_id_idx" ON "_pages_v_blocks_tours_rail" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tours_rail_path_idx" ON "_pages_v_blocks_tours_rail" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_tours_rail_locales_locale_parent_id_unique" ON "_pages_v_blocks_tours_rail_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_departures_band_order_idx" ON "_pages_v_blocks_departures_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_departures_band_parent_id_idx" ON "_pages_v_blocks_departures_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_departures_band_path_idx" ON "_pages_v_blocks_departures_band" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_departures_band_locales_locale_parent_id_uni" ON "_pages_v_blocks_departures_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_offers_rail_order_idx" ON "_pages_v_blocks_offers_rail" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_offers_rail_parent_id_idx" ON "_pages_v_blocks_offers_rail" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_offers_rail_path_idx" ON "_pages_v_blocks_offers_rail" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_offers_rail_locales_locale_parent_id_unique" ON "_pages_v_blocks_offers_rail_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_destinations_rail_order_idx" ON "_pages_v_blocks_destinations_rail" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_destinations_rail_parent_id_idx" ON "_pages_v_blocks_destinations_rail" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_destinations_rail_path_idx" ON "_pages_v_blocks_destinations_rail" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_destinations_rail_locales_locale_parent_id_u" ON "_pages_v_blocks_destinations_rail_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_value_props_items_order_idx" ON "_pages_v_blocks_value_props_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_value_props_items_parent_id_idx" ON "_pages_v_blocks_value_props_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_value_props_items_locales_locale_parent_id_u" ON "_pages_v_blocks_value_props_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_value_props_order_idx" ON "_pages_v_blocks_value_props" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_value_props_parent_id_idx" ON "_pages_v_blocks_value_props" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_value_props_path_idx" ON "_pages_v_blocks_value_props" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_value_props_locales_locale_parent_id_unique" ON "_pages_v_blocks_value_props_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_order_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_banner_parent_id_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_path_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_banner_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_banner_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_blog_rail_order_idx" ON "_pages_v_blocks_blog_rail" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_blog_rail_parent_id_idx" ON "_pages_v_blocks_blog_rail" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_blog_rail_path_idx" ON "_pages_v_blocks_blog_rail" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_blog_rail_locales_locale_parent_id_unique" ON "_pages_v_blocks_blog_rail_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_order_idx" ON "_pages_v_blocks_page_header" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_header_parent_id_idx" ON "_pages_v_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_path_idx" ON "_pages_v_blocks_page_header" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_header_image_idx" ON "_pages_v_blocks_page_header" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_header_locales_locale_parent_id_unique" ON "_pages_v_blocks_page_header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_section_order_idx" ON "_pages_v_blocks_rich_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_section_parent_id_idx" ON "_pages_v_blocks_rich_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_section_path_idx" ON "_pages_v_blocks_rich_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_section_image_idx" ON "_pages_v_blocks_rich_section" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_rich_section_locales_locale_parent_id_unique" ON "_pages_v_blocks_rich_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_strip_items_order_idx" ON "_pages_v_blocks_stats_strip_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_strip_items_parent_id_idx" ON "_pages_v_blocks_stats_strip_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_strip_items_locales_locale_parent_id_u" ON "_pages_v_blocks_stats_strip_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_strip_order_idx" ON "_pages_v_blocks_stats_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_strip_parent_id_idx" ON "_pages_v_blocks_stats_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_strip_path_idx" ON "_pages_v_blocks_stats_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_section_items_order_idx" ON "_pages_v_blocks_faq_section_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_section_items_parent_id_idx" ON "_pages_v_blocks_faq_section_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_section_items_locales_locale_parent_id_u" ON "_pages_v_blocks_faq_section_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_section_order_idx" ON "_pages_v_blocks_faq_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_section_parent_id_idx" ON "_pages_v_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_section_path_idx" ON "_pages_v_blocks_faq_section" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_section_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_section_order_idx" ON "_pages_v_blocks_contact_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_section_parent_id_idx" ON "_pages_v_blocks_contact_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_section_path_idx" ON "_pages_v_blocks_contact_section" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_section_locales_locale_parent_id_uni" ON "_pages_v_blocks_contact_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_vehicle_grid_order_idx" ON "_pages_v_blocks_vehicle_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_vehicle_grid_parent_id_idx" ON "_pages_v_blocks_vehicle_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_vehicle_grid_path_idx" ON "_pages_v_blocks_vehicle_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_vehicle_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_vehicle_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_media_gallery_order_idx" ON "_pages_v_blocks_media_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_gallery_parent_id_idx" ON "_pages_v_blocks_media_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_gallery_path_idx" ON "_pages_v_blocks_media_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_media_gallery_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_media_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_hotels_block_hotels_order_idx" ON "_pages_v_blocks_hotels_block_hotels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hotels_block_hotels_parent_id_idx" ON "_pages_v_blocks_hotels_block_hotels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hotels_block_hotels_hotel_idx" ON "_pages_v_blocks_hotels_block_hotels" USING btree ("hotel_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hotels_block_hotels_locales_locale_parent_id" ON "_pages_v_blocks_hotels_block_hotels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hotels_block_order_idx" ON "_pages_v_blocks_hotels_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hotels_block_parent_id_idx" ON "_pages_v_blocks_hotels_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hotels_block_path_idx" ON "_pages_v_blocks_hotels_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_included_excluded_included_order_idx" ON "_pages_v_blocks_included_excluded_included" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_included_excluded_included_parent_id_idx" ON "_pages_v_blocks_included_excluded_included" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_included_excluded_included_locales_locale_pa" ON "_pages_v_blocks_included_excluded_included_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_included_excluded_excluded_order_idx" ON "_pages_v_blocks_included_excluded_excluded" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_included_excluded_excluded_parent_id_idx" ON "_pages_v_blocks_included_excluded_excluded" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_included_excluded_excluded_locales_locale_pa" ON "_pages_v_blocks_included_excluded_excluded_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_included_excluded_order_idx" ON "_pages_v_blocks_included_excluded" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_included_excluded_parent_id_idx" ON "_pages_v_blocks_included_excluded" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_included_excluded_path_idx" ON "_pages_v_blocks_included_excluded" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_block_order_idx" ON "_pages_v_blocks_video_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_block_parent_id_idx" ON "_pages_v_blocks_video_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_block_path_idx" ON "_pages_v_blocks_video_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_best_time_block_items_order_idx" ON "_pages_v_blocks_best_time_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_best_time_block_items_parent_id_idx" ON "_pages_v_blocks_best_time_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_best_time_block_items_locale_idx" ON "_pages_v_blocks_best_time_block_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_best_time_block_order_idx" ON "_pages_v_blocks_best_time_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_best_time_block_parent_id_idx" ON "_pages_v_blocks_best_time_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_best_time_block_path_idx" ON "_pages_v_blocks_best_time_block" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_best_time_block_locales_locale_parent_id_uni" ON "_pages_v_blocks_best_time_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_block_questions_order_idx" ON "_pages_v_blocks_faq_block_questions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_block_questions_parent_id_idx" ON "_pages_v_blocks_faq_block_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_block_questions_locales_locale_parent_id" ON "_pages_v_blocks_faq_block_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_block_order_idx" ON "_pages_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_block_parent_id_idx" ON "_pages_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_block_path_idx" ON "_pages_v_blocks_faq_block" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_block_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_link_hubs_block_links_order_idx" ON "_pages_v_blocks_link_hubs_block_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_hubs_block_links_parent_id_idx" ON "_pages_v_blocks_link_hubs_block_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_link_hubs_block_links_locales_locale_parent_" ON "_pages_v_blocks_link_hubs_block_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_link_hubs_block_order_idx" ON "_pages_v_blocks_link_hubs_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_hubs_block_parent_id_idx" ON "_pages_v_blocks_link_hubs_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_hubs_block_path_idx" ON "_pages_v_blocks_link_hubs_block" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_link_hubs_block_locales_locale_parent_id_uni" ON "_pages_v_blocks_link_hubs_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_title_block_order_idx" ON "_pages_v_blocks_title_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_title_block_parent_id_idx" ON "_pages_v_blocks_title_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_title_block_path_idx" ON "_pages_v_blocks_title_block" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_title_block_locales_locale_parent_id_unique" ON "_pages_v_blocks_title_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_order_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_images_parent_id_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_image_idx" ON "_pages_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_fact_chips_facts_order_idx" ON "_pages_v_blocks_fact_chips_facts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_fact_chips_facts_parent_id_idx" ON "_pages_v_blocks_fact_chips_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_fact_chips_facts_locales_locale_parent_id_un" ON "_pages_v_blocks_fact_chips_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_fact_chips_order_idx" ON "_pages_v_blocks_fact_chips" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_fact_chips_parent_id_idx" ON "_pages_v_blocks_fact_chips" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_fact_chips_path_idx" ON "_pages_v_blocks_fact_chips" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_sticky_tabs_tabs_order_idx" ON "_pages_v_blocks_sticky_tabs_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sticky_tabs_tabs_parent_id_idx" ON "_pages_v_blocks_sticky_tabs_tabs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_sticky_tabs_tabs_locales_locale_parent_id_un" ON "_pages_v_blocks_sticky_tabs_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_sticky_tabs_order_idx" ON "_pages_v_blocks_sticky_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sticky_tabs_parent_id_idx" ON "_pages_v_blocks_sticky_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sticky_tabs_path_idx" ON "_pages_v_blocks_sticky_tabs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_itinerary_days_meals_order_idx" ON "_pages_v_blocks_itinerary_days_meals" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_itinerary_days_meals_parent_idx" ON "_pages_v_blocks_itinerary_days_meals" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_itinerary_days_order_idx" ON "_pages_v_blocks_itinerary_days" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_itinerary_days_parent_id_idx" ON "_pages_v_blocks_itinerary_days" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_itinerary_days_hotel_idx" ON "_pages_v_blocks_itinerary_days" USING btree ("hotel_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_itinerary_days_locales_locale_parent_id_uniq" ON "_pages_v_blocks_itinerary_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_itinerary_order_idx" ON "_pages_v_blocks_itinerary" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_itinerary_parent_id_idx" ON "_pages_v_blocks_itinerary" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_itinerary_path_idx" ON "_pages_v_blocks_itinerary" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_overview_order_idx" ON "_pages_v_blocks_overview" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_overview_parent_id_idx" ON "_pages_v_blocks_overview" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_overview_path_idx" ON "_pages_v_blocks_overview" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_overview_locales_locale_parent_id_unique" ON "_pages_v_blocks_overview_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_accessibility_section_order_idx" ON "_pages_v_blocks_accessibility_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accessibility_section_parent_id_idx" ON "_pages_v_blocks_accessibility_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accessibility_section_path_idx" ON "_pages_v_blocks_accessibility_section" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_accessibility_section_locales_locale_parent_" ON "_pages_v_blocks_accessibility_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_reviews_block_order_idx" ON "_pages_v_blocks_reviews_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_reviews_block_parent_id_idx" ON "_pages_v_blocks_reviews_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_reviews_block_path_idx" ON "_pages_v_blocks_reviews_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_reviews_block_reviews_idx" ON "_pages_v_blocks_reviews_block" USING btree ("reviews_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_reviews_block_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_reviews_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_booking_card_order_idx" ON "_pages_v_blocks_booking_card" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_booking_card_parent_id_idx" ON "_pages_v_blocks_booking_card" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_booking_card_path_idx" ON "_pages_v_blocks_booking_card" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_booking_card_reference_idx" ON "_pages_v_blocks_booking_card" USING btree ("reference_id");
  CREATE INDEX "_pages_v_blocks_booking_card_tour_idx" ON "_pages_v_blocks_booking_card" USING btree ("tour_id");
  CREATE INDEX "_pages_v_blocks_booking_card_vehicle_idx" ON "_pages_v_blocks_booking_card" USING btree ("vehicle_id");
  CREATE INDEX "_pages_v_blocks_booking_card_joint_departure_idx" ON "_pages_v_blocks_booking_card" USING btree ("joint_departure_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_booking_card_locales_locale_parent_id_unique" ON "_pages_v_blocks_booking_card_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_similar_items_order_idx" ON "_pages_v_blocks_similar_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_similar_items_parent_id_idx" ON "_pages_v_blocks_similar_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_similar_items_path_idx" ON "_pages_v_blocks_similar_items" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_similar_items_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_similar_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_departure_list_order_idx" ON "_pages_v_blocks_departure_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_departure_list_parent_id_idx" ON "_pages_v_blocks_departure_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_departure_list_path_idx" ON "_pages_v_blocks_departure_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_offer_banner_order_idx" ON "_pages_v_blocks_offer_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_offer_banner_parent_id_idx" ON "_pages_v_blocks_offer_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_offer_banner_path_idx" ON "_pages_v_blocks_offer_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_offer_banner_link_idx" ON "_pages_v_blocks_offer_banner" USING btree ("link_id");
  CREATE INDEX "_pages_v_blocks_author_box_order_idx" ON "_pages_v_blocks_author_box" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_author_box_parent_id_idx" ON "_pages_v_blocks_author_box" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_author_box_path_idx" ON "_pages_v_blocks_author_box" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_author_box_author_idx" ON "_pages_v_blocks_author_box" USING btree ("author_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_author_box_locales_locale_parent_id_unique" ON "_pages_v_blocks_author_box_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_group_discount_table_discounts_order_idx" ON "_pages_v_blocks_group_discount_table_discounts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_group_discount_table_discounts_parent_id_idx" ON "_pages_v_blocks_group_discount_table_discounts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_group_discount_table_discounts_locales_local" ON "_pages_v_blocks_group_discount_table_discounts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_group_discount_table_order_idx" ON "_pages_v_blocks_group_discount_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_group_discount_table_parent_id_idx" ON "_pages_v_blocks_group_discount_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_group_discount_table_path_idx" ON "_pages_v_blocks_group_discount_table" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_how_it_works_steps_order_idx" ON "_pages_v_blocks_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_it_works_steps_parent_id_idx" ON "_pages_v_blocks_how_it_works_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_how_it_works_steps_locales_locale_parent_id_" ON "_pages_v_blocks_how_it_works_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_how_it_works_order_idx" ON "_pages_v_blocks_how_it_works" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_it_works_parent_id_idx" ON "_pages_v_blocks_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_how_it_works_path_idx" ON "_pages_v_blocks_how_it_works" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_newsletter_locales_locale_parent_id_unique" ON "_pages_v_blocks_newsletter_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_terms_faq_order_idx" ON "_pages_v_blocks_terms_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_terms_faq_parent_id_idx" ON "_pages_v_blocks_terms_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_terms_faq_path_idx" ON "_pages_v_blocks_terms_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_terms_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_terms_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_order_idx" ON "_pages_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_parent_id_idx" ON "_pages_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_path_idx" ON "_pages_v_blocks_cta_band" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_band_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_features_safety_items_order_idx" ON "_pages_v_blocks_features_safety_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_safety_items_parent_id_idx" ON "_pages_v_blocks_features_safety_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_features_safety_items_locales_locale_parent_" ON "_pages_v_blocks_features_safety_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_features_safety_order_idx" ON "_pages_v_blocks_features_safety" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_safety_parent_id_idx" ON "_pages_v_blocks_features_safety" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_safety_path_idx" ON "_pages_v_blocks_features_safety" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_what_to_expect_items_order_idx" ON "_pages_v_blocks_what_to_expect_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_what_to_expect_items_parent_id_idx" ON "_pages_v_blocks_what_to_expect_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_what_to_expect_items_locales_locale_parent_i" ON "_pages_v_blocks_what_to_expect_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_what_to_expect_order_idx" ON "_pages_v_blocks_what_to_expect" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_what_to_expect_parent_id_idx" ON "_pages_v_blocks_what_to_expect" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_what_to_expect_path_idx" ON "_pages_v_blocks_what_to_expect" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_specs_table_specs_order_idx" ON "_pages_v_blocks_specs_table_specs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_specs_table_specs_parent_id_idx" ON "_pages_v_blocks_specs_table_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_specs_table_specs_locales_locale_parent_id_u" ON "_pages_v_blocks_specs_table_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_specs_table_order_idx" ON "_pages_v_blocks_specs_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_specs_table_parent_id_idx" ON "_pages_v_blocks_specs_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_specs_table_path_idx" ON "_pages_v_blocks_specs_table" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_tours_using_vehicle_order_idx" ON "_pages_v_blocks_tours_using_vehicle" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tours_using_vehicle_parent_id_idx" ON "_pages_v_blocks_tours_using_vehicle" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tours_using_vehicle_path_idx" ON "_pages_v_blocks_tours_using_vehicle" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_tours_using_vehicle_locales_locale_parent_id" ON "_pages_v_blocks_tours_using_vehicle_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_seat_map_order_idx" ON "_pages_v_blocks_seat_map" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_seat_map_parent_id_idx" ON "_pages_v_blocks_seat_map" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_seat_map_path_idx" ON "_pages_v_blocks_seat_map" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_seat_map_locales_locale_parent_id_unique" ON "_pages_v_blocks_seat_map_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_price_table_table_data_row_order_idx" ON "_pages_v_blocks_price_table_table_data_row" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_price_table_table_data_row_parent_id_idx" ON "_pages_v_blocks_price_table_table_data_row" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_price_table_table_data_row_locales_locale_pa" ON "_pages_v_blocks_price_table_table_data_row_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_price_table_table_data_order_idx" ON "_pages_v_blocks_price_table_table_data" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_price_table_table_data_parent_id_idx" ON "_pages_v_blocks_price_table_table_data" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_price_table_order_idx" ON "_pages_v_blocks_price_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_price_table_parent_id_idx" ON "_pages_v_blocks_price_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_price_table_path_idx" ON "_pages_v_blocks_price_table" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_price_matrix_order_idx" ON "_pages_v_blocks_price_matrix" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_price_matrix_parent_id_idx" ON "_pages_v_blocks_price_matrix" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_price_matrix_path_idx" ON "_pages_v_blocks_price_matrix" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_policy_block_order_idx" ON "_pages_v_blocks_policy_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_policy_block_parent_id_idx" ON "_pages_v_blocks_policy_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_policy_block_path_idx" ON "_pages_v_blocks_policy_block" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_policy_block_locales_locale_parent_id_unique" ON "_pages_v_blocks_policy_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_categories_order_idx" ON "_pages_v_blocks_category_tiles_categories" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_tiles_categories_parent_id_idx" ON "_pages_v_blocks_category_tiles_categories" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_categories_image_idx" ON "_pages_v_blocks_category_tiles_categories" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_category_tiles_categories_locales_locale_par" ON "_pages_v_blocks_category_tiles_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_order_idx" ON "_pages_v_blocks_category_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_tiles_parent_id_idx" ON "_pages_v_blocks_category_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_path_idx" ON "_pages_v_blocks_category_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_category_tiles_locales_locale_parent_id_uniq" ON "_pages_v_blocks_category_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_tours_order_idx" ON "_pages_v_blocks_featured_tours" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_tours_parent_id_idx" ON "_pages_v_blocks_featured_tours" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_tours_path_idx" ON "_pages_v_blocks_featured_tours" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_featured_tours_locales_locale_parent_id_uniq" ON "_pages_v_blocks_featured_tours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_destination_tiles_destinations_order_idx" ON "_pages_v_blocks_destination_tiles_destinations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_destination_tiles_destinations_parent_id_idx" ON "_pages_v_blocks_destination_tiles_destinations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_destination_tiles_destinations_image_idx" ON "_pages_v_blocks_destination_tiles_destinations" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_destination_tiles_destinations_locales_local" ON "_pages_v_blocks_destination_tiles_destinations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_destination_tiles_order_idx" ON "_pages_v_blocks_destination_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_destination_tiles_parent_id_idx" ON "_pages_v_blocks_destination_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_destination_tiles_path_idx" ON "_pages_v_blocks_destination_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_destination_tiles_locales_locale_parent_id_u" ON "_pages_v_blocks_destination_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_social_feed_posts_order_idx" ON "_pages_v_blocks_social_feed_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_social_feed_posts_parent_id_idx" ON "_pages_v_blocks_social_feed_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_social_feed_posts_image_idx" ON "_pages_v_blocks_social_feed_posts" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_social_feed_order_idx" ON "_pages_v_blocks_social_feed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_social_feed_parent_id_idx" ON "_pages_v_blocks_social_feed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_social_feed_path_idx" ON "_pages_v_blocks_social_feed" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_social_feed_locales_locale_parent_id_unique" ON "_pages_v_blocks_social_feed_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_tours_id_idx" ON "_pages_v_rels" USING btree ("tours_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "tours_highlights_order_idx" ON "tours_highlights" USING btree ("_order");
  CREATE INDEX "tours_highlights_parent_id_idx" ON "tours_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_highlights_locales_locale_parent_id_unique" ON "tours_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_itinerary_meals_order_idx" ON "tours_itinerary_meals" USING btree ("order");
  CREATE INDEX "tours_itinerary_meals_parent_idx" ON "tours_itinerary_meals" USING btree ("parent_id");
  CREATE INDEX "tours_itinerary_order_idx" ON "tours_itinerary" USING btree ("_order");
  CREATE INDEX "tours_itinerary_parent_id_idx" ON "tours_itinerary" USING btree ("_parent_id");
  CREATE INDEX "tours_itinerary_hotel_idx" ON "tours_itinerary" USING btree ("hotel_id");
  CREATE UNIQUE INDEX "tours_itinerary_locales_locale_parent_id_unique" ON "tours_itinerary_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_included_order_idx" ON "tours_included" USING btree ("_order");
  CREATE INDEX "tours_included_parent_id_idx" ON "tours_included" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_included_locales_locale_parent_id_unique" ON "tours_included_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_excluded_order_idx" ON "tours_excluded" USING btree ("_order");
  CREATE INDEX "tours_excluded_parent_id_idx" ON "tours_excluded" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_excluded_locales_locale_parent_id_unique" ON "tours_excluded_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_pricing_matrix_order_idx" ON "tours_pricing_matrix" USING btree ("_order");
  CREATE INDEX "tours_pricing_matrix_parent_id_idx" ON "tours_pricing_matrix" USING btree ("_parent_id");
  CREATE INDEX "tours_pricing_matrix_season_idx" ON "tours_pricing_matrix" USING btree ("season_id");
  CREATE INDEX "tours_gallery_order_idx" ON "tours_gallery" USING btree ("_order");
  CREATE INDEX "tours_gallery_parent_id_idx" ON "tours_gallery" USING btree ("_parent_id");
  CREATE INDEX "tours_gallery_image_idx" ON "tours_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "tours_gallery_locales_locale_parent_id_unique" ON "tours_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_videos_order_idx" ON "tours_videos" USING btree ("_order");
  CREATE INDEX "tours_videos_parent_id_idx" ON "tours_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_videos_locales_locale_parent_id_unique" ON "tours_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_accessibility_features_order_idx" ON "tours_accessibility_features" USING btree ("_order");
  CREATE INDEX "tours_accessibility_features_parent_id_idx" ON "tours_accessibility_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_accessibility_features_locales_locale_parent_id_unique" ON "tours_accessibility_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_best_time_order_idx" ON "tours_best_time" USING btree ("_order");
  CREATE INDEX "tours_best_time_parent_id_idx" ON "tours_best_time" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_best_time_locales_locale_parent_id_unique" ON "tours_best_time_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_faq_order_idx" ON "tours_faq" USING btree ("_order");
  CREATE INDEX "tours_faq_parent_id_idx" ON "tours_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_faq_locales_locale_parent_id_unique" ON "tours_faq_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "tours_slug_idx" ON "tours" USING btree ("slug");
  CREATE INDEX "tours_template_idx" ON "tours" USING btree ("template_id");
  CREATE INDEX "tours_destination_idx" ON "tours" USING btree ("destination_id");
  CREATE INDEX "tours_hero_image_idx" ON "tours" USING btree ("hero_image_id");
  CREATE INDEX "tours_itinerary_pdf_idx" ON "tours" USING btree ("itinerary_pdf_id");
  CREATE INDEX "tours_accessibility_accessibility_vehicle_idx" ON "tours" USING btree ("accessibility_vehicle_id");
  CREATE INDEX "tours_seo_seo_image_idx" ON "tours" USING btree ("seo_image_id");
  CREATE INDEX "tours_updated_at_idx" ON "tours" USING btree ("updated_at");
  CREATE INDEX "tours_created_at_idx" ON "tours" USING btree ("created_at");
  CREATE UNIQUE INDEX "tours_locales_locale_parent_id_unique" ON "tours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_rels_order_idx" ON "tours_rels" USING btree ("order");
  CREATE INDEX "tours_rels_parent_idx" ON "tours_rels" USING btree ("parent_id");
  CREATE INDEX "tours_rels_path_idx" ON "tours_rels" USING btree ("path");
  CREATE INDEX "tours_rels_categories_id_idx" ON "tours_rels" USING btree ("categories_id");
  CREATE INDEX "tours_rels_tours_id_idx" ON "tours_rels" USING btree ("tours_id");
  CREATE INDEX "vehicles_gallery_order_idx" ON "vehicles_gallery" USING btree ("_order");
  CREATE INDEX "vehicles_gallery_parent_id_idx" ON "vehicles_gallery" USING btree ("_parent_id");
  CREATE INDEX "vehicles_gallery_image_idx" ON "vehicles_gallery" USING btree ("image_id");
  CREATE INDEX "vehicles_features_order_idx" ON "vehicles_features" USING btree ("_order");
  CREATE INDEX "vehicles_features_parent_id_idx" ON "vehicles_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vehicles_features_locales_locale_parent_id_unique" ON "vehicles_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "vehicles_specs_order_idx" ON "vehicles_specs" USING btree ("_order");
  CREATE INDEX "vehicles_specs_parent_id_idx" ON "vehicles_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vehicles_specs_locales_locale_parent_id_unique" ON "vehicles_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "vehicles_rates_order_idx" ON "vehicles_rates" USING btree ("_order");
  CREATE INDEX "vehicles_rates_parent_id_idx" ON "vehicles_rates" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vehicles_rates_locales_locale_parent_id_unique" ON "vehicles_rates_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vehicles_slug_idx" ON "vehicles" USING btree ("slug");
  CREATE INDEX "vehicles_hero_image_idx" ON "vehicles" USING btree ("hero_image_id");
  CREATE INDEX "vehicles_updated_at_idx" ON "vehicles" USING btree ("updated_at");
  CREATE INDEX "vehicles_created_at_idx" ON "vehicles" USING btree ("created_at");
  CREATE UNIQUE INDEX "vehicles_locales_locale_parent_id_unique" ON "vehicles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "seasons_updated_at_idx" ON "seasons" USING btree ("updated_at");
  CREATE INDEX "seasons_created_at_idx" ON "seasons" USING btree ("created_at");
  CREATE UNIQUE INDEX "seasons_locales_locale_parent_id_unique" ON "seasons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offers_how_it_works_order_idx" ON "offers_how_it_works" USING btree ("_order");
  CREATE INDEX "offers_how_it_works_parent_id_idx" ON "offers_how_it_works" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "offers_how_it_works_locales_locale_parent_id_unique" ON "offers_how_it_works_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "offers_slug_idx" ON "offers" USING btree ("slug");
  CREATE INDEX "offers_hero_image_idx" ON "offers" USING btree ("hero_image_id");
  CREATE INDEX "offers_updated_at_idx" ON "offers" USING btree ("updated_at");
  CREATE INDEX "offers_created_at_idx" ON "offers" USING btree ("created_at");
  CREATE UNIQUE INDEX "offers_locales_locale_parent_id_unique" ON "offers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offers_rels_order_idx" ON "offers_rels" USING btree ("order");
  CREATE INDEX "offers_rels_parent_idx" ON "offers_rels" USING btree ("parent_id");
  CREATE INDEX "offers_rels_path_idx" ON "offers_rels" USING btree ("path");
  CREATE INDEX "offers_rels_tours_id_idx" ON "offers_rels" USING btree ("tours_id");
  CREATE INDEX "hotels_image_idx" ON "hotels" USING btree ("image_id");
  CREATE INDEX "hotels_updated_at_idx" ON "hotels" USING btree ("updated_at");
  CREATE INDEX "hotels_created_at_idx" ON "hotels" USING btree ("created_at");
  CREATE UNIQUE INDEX "hotels_locales_locale_parent_id_unique" ON "hotels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "joint_departures_tour_idx" ON "joint_departures" USING btree ("tour_id");
  CREATE UNIQUE INDEX "joint_departures_slug_idx" ON "joint_departures" USING btree ("slug");
  CREATE INDEX "joint_departures_vehicle_idx" ON "joint_departures" USING btree ("vehicle_id");
  CREATE INDEX "joint_departures_updated_at_idx" ON "joint_departures" USING btree ("updated_at");
  CREATE INDEX "joint_departures_created_at_idx" ON "joint_departures" USING btree ("created_at");
  CREATE UNIQUE INDEX "joint_departures_locales_locale_parent_id_unique" ON "joint_departures_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations" USING btree ("slug");
  CREATE INDEX "destinations_image_idx" ON "destinations" USING btree ("image_id");
  CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  CREATE UNIQUE INDEX "destinations_locales_locale_parent_id_unique" ON "destinations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "templates_sections_order_idx" ON "templates_sections" USING btree ("_order");
  CREATE INDEX "templates_sections_parent_id_idx" ON "templates_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "templates_sections_locales_locale_parent_id_unique" ON "templates_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "templates_tabs_order_idx" ON "templates_tabs" USING btree ("_order");
  CREATE INDEX "templates_tabs_parent_id_idx" ON "templates_tabs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "templates_tabs_locales_locale_parent_id_unique" ON "templates_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "templates_updated_at_idx" ON "templates" USING btree ("updated_at");
  CREATE INDEX "templates_created_at_idx" ON "templates" USING btree ("created_at");
  CREATE INDEX "gallery_items_image_idx" ON "gallery_items" USING btree ("image_id");
  CREATE INDEX "gallery_items_destination_idx" ON "gallery_items" USING btree ("destination_id");
  CREATE INDEX "gallery_items_updated_at_idx" ON "gallery_items" USING btree ("updated_at");
  CREATE INDEX "gallery_items_created_at_idx" ON "gallery_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "gallery_items_locales_locale_parent_id_unique" ON "gallery_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiries_tour_idx" ON "inquiries" USING btree ("tour_id");
  CREATE INDEX "inquiries_offer_idx" ON "inquiries" USING btree ("offer_id");
  CREATE INDEX "inquiries_vehicle_idx" ON "inquiries" USING btree ("vehicle_id");
  CREATE INDEX "inquiries_departure_idx" ON "inquiries" USING btree ("departure_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_tours_id_idx" ON "payload_locked_documents_rels" USING btree ("tours_id");
  CREATE INDEX "payload_locked_documents_rels_vehicles_id_idx" ON "payload_locked_documents_rels" USING btree ("vehicles_id");
  CREATE INDEX "payload_locked_documents_rels_seasons_id_idx" ON "payload_locked_documents_rels" USING btree ("seasons_id");
  CREATE INDEX "payload_locked_documents_rels_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("offers_id");
  CREATE INDEX "payload_locked_documents_rels_hotels_id_idx" ON "payload_locked_documents_rels" USING btree ("hotels_id");
  CREATE INDEX "payload_locked_documents_rels_joint_departures_id_idx" ON "payload_locked_documents_rels" USING btree ("joint_departures_id");
  CREATE INDEX "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");
  CREATE INDEX "payload_locked_documents_rels_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("templates_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_items_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_items_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_items_children_order_idx" ON "header_items_children" USING btree ("_order");
  CREATE INDEX "header_items_children_parent_id_idx" ON "header_items_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_items_children_locales_locale_parent_id_unique" ON "header_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_items_order_idx" ON "header_items" USING btree ("_order");
  CREATE INDEX "header_items_parent_id_idx" ON "header_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_items_locales_locale_parent_id_unique" ON "header_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_legal_links_locales_locale_parent_id_unique" ON "footer_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_trust_order_idx" ON "site_settings_trust" USING btree ("_order");
  CREATE INDEX "site_settings_trust_parent_id_idx" ON "site_settings_trust" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_trust_locales_locale_parent_id_unique" ON "site_settings_trust_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_payment_methods_order_idx" ON "site_settings_payment_methods" USING btree ("_order");
  CREATE INDEX "site_settings_payment_methods_parent_id_idx" ON "site_settings_payment_methods" USING btree ("_parent_id");
  CREATE INDEX "site_settings_currencies_order_idx" ON "site_settings_currencies" USING btree ("_order");
  CREATE INDEX "site_settings_currencies_parent_id_idx" ON "site_settings_currencies" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seo_seo_default_og_image_idx" ON "site_settings" USING btree ("seo_default_og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "company_credentials_order_idx" ON "company_credentials" USING btree ("_order");
  CREATE INDEX "company_credentials_parent_id_idx" ON "company_credentials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "company_credentials_locales_locale_parent_id_unique" ON "company_credentials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "company_logo_idx" ON "company" USING btree ("logo_id");
  CREATE UNIQUE INDEX "company_locales_locale_parent_id_unique" ON "company_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "routes_routes_order_idx" ON "routes_routes" USING btree ("_order");
  CREATE INDEX "routes_routes_parent_id_idx" ON "routes_routes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "routes_routes_locales_locale_parent_id_unique" ON "routes_routes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "translations_entries_order_idx" ON "translations_entries" USING btree ("_order");
  CREATE INDEX "translations_entries_parent_id_idx" ON "translations_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "translations_entries_locales_locale_parent_id_unique" ON "translations_entries_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_blocks_home_hero_slides" CASCADE;
  DROP TABLE "pages_blocks_home_hero_slides_locales" CASCADE;
  DROP TABLE "pages_blocks_home_hero" CASCADE;
  DROP TABLE "pages_blocks_trip_finder" CASCADE;
  DROP TABLE "pages_blocks_ways_to_travel_tiles" CASCADE;
  DROP TABLE "pages_blocks_ways_to_travel_tiles_locales" CASCADE;
  DROP TABLE "pages_blocks_ways_to_travel" CASCADE;
  DROP TABLE "pages_blocks_ways_to_travel_locales" CASCADE;
  DROP TABLE "pages_blocks_tours_rail" CASCADE;
  DROP TABLE "pages_blocks_tours_rail_locales" CASCADE;
  DROP TABLE "pages_blocks_departures_band" CASCADE;
  DROP TABLE "pages_blocks_departures_band_locales" CASCADE;
  DROP TABLE "pages_blocks_offers_rail" CASCADE;
  DROP TABLE "pages_blocks_offers_rail_locales" CASCADE;
  DROP TABLE "pages_blocks_destinations_rail" CASCADE;
  DROP TABLE "pages_blocks_destinations_rail_locales" CASCADE;
  DROP TABLE "pages_blocks_value_props_items" CASCADE;
  DROP TABLE "pages_blocks_value_props_items_locales" CASCADE;
  DROP TABLE "pages_blocks_value_props" CASCADE;
  DROP TABLE "pages_blocks_value_props_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_banner" CASCADE;
  DROP TABLE "pages_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "pages_blocks_blog_rail" CASCADE;
  DROP TABLE "pages_blocks_blog_rail_locales" CASCADE;
  DROP TABLE "pages_blocks_page_header" CASCADE;
  DROP TABLE "pages_blocks_page_header_locales" CASCADE;
  DROP TABLE "pages_blocks_rich_section" CASCADE;
  DROP TABLE "pages_blocks_rich_section_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_strip_items" CASCADE;
  DROP TABLE "pages_blocks_stats_strip_items_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_strip" CASCADE;
  DROP TABLE "pages_blocks_faq_section_items" CASCADE;
  DROP TABLE "pages_blocks_faq_section_items_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_section" CASCADE;
  DROP TABLE "pages_blocks_faq_section_locales" CASCADE;
  DROP TABLE "pages_blocks_contact_section" CASCADE;
  DROP TABLE "pages_blocks_contact_section_locales" CASCADE;
  DROP TABLE "pages_blocks_vehicle_grid" CASCADE;
  DROP TABLE "pages_blocks_vehicle_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_media_gallery" CASCADE;
  DROP TABLE "pages_blocks_media_gallery_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_hotels_block_hotels" CASCADE;
  DROP TABLE "pages_blocks_hotels_block_hotels_locales" CASCADE;
  DROP TABLE "pages_blocks_hotels_block" CASCADE;
  DROP TABLE "pages_blocks_included_excluded_included" CASCADE;
  DROP TABLE "pages_blocks_included_excluded_included_locales" CASCADE;
  DROP TABLE "pages_blocks_included_excluded_excluded" CASCADE;
  DROP TABLE "pages_blocks_included_excluded_excluded_locales" CASCADE;
  DROP TABLE "pages_blocks_included_excluded" CASCADE;
  DROP TABLE "pages_blocks_video_block" CASCADE;
  DROP TABLE "pages_blocks_best_time_block_items" CASCADE;
  DROP TABLE "pages_blocks_best_time_block" CASCADE;
  DROP TABLE "pages_blocks_best_time_block_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_block_questions" CASCADE;
  DROP TABLE "pages_blocks_faq_block_questions_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_block" CASCADE;
  DROP TABLE "pages_blocks_faq_block_locales" CASCADE;
  DROP TABLE "pages_blocks_link_hubs_block_links" CASCADE;
  DROP TABLE "pages_blocks_link_hubs_block_links_locales" CASCADE;
  DROP TABLE "pages_blocks_link_hubs_block" CASCADE;
  DROP TABLE "pages_blocks_link_hubs_block_locales" CASCADE;
  DROP TABLE "pages_blocks_title_block" CASCADE;
  DROP TABLE "pages_blocks_title_block_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_fact_chips_facts" CASCADE;
  DROP TABLE "pages_blocks_fact_chips_facts_locales" CASCADE;
  DROP TABLE "pages_blocks_fact_chips" CASCADE;
  DROP TABLE "pages_blocks_sticky_tabs_tabs" CASCADE;
  DROP TABLE "pages_blocks_sticky_tabs_tabs_locales" CASCADE;
  DROP TABLE "pages_blocks_sticky_tabs" CASCADE;
  DROP TABLE "pages_blocks_itinerary_days_meals" CASCADE;
  DROP TABLE "pages_blocks_itinerary_days" CASCADE;
  DROP TABLE "pages_blocks_itinerary_days_locales" CASCADE;
  DROP TABLE "pages_blocks_itinerary" CASCADE;
  DROP TABLE "pages_blocks_overview" CASCADE;
  DROP TABLE "pages_blocks_overview_locales" CASCADE;
  DROP TABLE "pages_blocks_accessibility_section" CASCADE;
  DROP TABLE "pages_blocks_accessibility_section_locales" CASCADE;
  DROP TABLE "pages_blocks_reviews_block" CASCADE;
  DROP TABLE "pages_blocks_reviews_block_locales" CASCADE;
  DROP TABLE "pages_blocks_booking_card" CASCADE;
  DROP TABLE "pages_blocks_booking_card_locales" CASCADE;
  DROP TABLE "pages_blocks_similar_items" CASCADE;
  DROP TABLE "pages_blocks_similar_items_locales" CASCADE;
  DROP TABLE "pages_blocks_departure_list" CASCADE;
  DROP TABLE "pages_blocks_offer_banner" CASCADE;
  DROP TABLE "pages_blocks_author_box" CASCADE;
  DROP TABLE "pages_blocks_author_box_locales" CASCADE;
  DROP TABLE "pages_blocks_group_discount_table_discounts" CASCADE;
  DROP TABLE "pages_blocks_group_discount_table_discounts_locales" CASCADE;
  DROP TABLE "pages_blocks_group_discount_table" CASCADE;
  DROP TABLE "pages_blocks_how_it_works_steps" CASCADE;
  DROP TABLE "pages_blocks_how_it_works_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_how_it_works" CASCADE;
  DROP TABLE "pages_blocks_newsletter" CASCADE;
  DROP TABLE "pages_blocks_newsletter_locales" CASCADE;
  DROP TABLE "pages_blocks_terms_faq" CASCADE;
  DROP TABLE "pages_blocks_terms_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "pages_blocks_cta_band_locales" CASCADE;
  DROP TABLE "pages_blocks_features_safety_items" CASCADE;
  DROP TABLE "pages_blocks_features_safety_items_locales" CASCADE;
  DROP TABLE "pages_blocks_features_safety" CASCADE;
  DROP TABLE "pages_blocks_what_to_expect_items" CASCADE;
  DROP TABLE "pages_blocks_what_to_expect_items_locales" CASCADE;
  DROP TABLE "pages_blocks_what_to_expect" CASCADE;
  DROP TABLE "pages_blocks_specs_table_specs" CASCADE;
  DROP TABLE "pages_blocks_specs_table_specs_locales" CASCADE;
  DROP TABLE "pages_blocks_specs_table" CASCADE;
  DROP TABLE "pages_blocks_tours_using_vehicle" CASCADE;
  DROP TABLE "pages_blocks_tours_using_vehicle_locales" CASCADE;
  DROP TABLE "pages_blocks_seat_map" CASCADE;
  DROP TABLE "pages_blocks_seat_map_locales" CASCADE;
  DROP TABLE "pages_blocks_price_table_table_data_row" CASCADE;
  DROP TABLE "pages_blocks_price_table_table_data_row_locales" CASCADE;
  DROP TABLE "pages_blocks_price_table_table_data" CASCADE;
  DROP TABLE "pages_blocks_price_table" CASCADE;
  DROP TABLE "pages_blocks_price_matrix" CASCADE;
  DROP TABLE "pages_blocks_policy_block" CASCADE;
  DROP TABLE "pages_blocks_policy_block_locales" CASCADE;
  DROP TABLE "pages_blocks_category_tiles_categories" CASCADE;
  DROP TABLE "pages_blocks_category_tiles_categories_locales" CASCADE;
  DROP TABLE "pages_blocks_category_tiles" CASCADE;
  DROP TABLE "pages_blocks_category_tiles_locales" CASCADE;
  DROP TABLE "pages_blocks_featured_tours" CASCADE;
  DROP TABLE "pages_blocks_featured_tours_locales" CASCADE;
  DROP TABLE "pages_blocks_destination_tiles_destinations" CASCADE;
  DROP TABLE "pages_blocks_destination_tiles_destinations_locales" CASCADE;
  DROP TABLE "pages_blocks_destination_tiles" CASCADE;
  DROP TABLE "pages_blocks_destination_tiles_locales" CASCADE;
  DROP TABLE "pages_blocks_social_feed_posts" CASCADE;
  DROP TABLE "pages_blocks_social_feed" CASCADE;
  DROP TABLE "pages_blocks_social_feed_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero_slides_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_trip_finder" CASCADE;
  DROP TABLE "_pages_v_blocks_ways_to_travel_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_ways_to_travel_tiles_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_ways_to_travel" CASCADE;
  DROP TABLE "_pages_v_blocks_ways_to_travel_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_tours_rail" CASCADE;
  DROP TABLE "_pages_v_blocks_tours_rail_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_departures_band" CASCADE;
  DROP TABLE "_pages_v_blocks_departures_band_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_offers_rail" CASCADE;
  DROP TABLE "_pages_v_blocks_offers_rail_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_destinations_rail" CASCADE;
  DROP TABLE "_pages_v_blocks_destinations_rail_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_value_props_items" CASCADE;
  DROP TABLE "_pages_v_blocks_value_props_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_value_props" CASCADE;
  DROP TABLE "_pages_v_blocks_value_props_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_blog_rail" CASCADE;
  DROP TABLE "_pages_v_blocks_blog_rail_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_header" CASCADE;
  DROP TABLE "_pages_v_blocks_page_header_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_section" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_strip_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_strip_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_section" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_vehicle_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_vehicle_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_media_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_media_gallery_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_hotels_block_hotels" CASCADE;
  DROP TABLE "_pages_v_blocks_hotels_block_hotels_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hotels_block" CASCADE;
  DROP TABLE "_pages_v_blocks_included_excluded_included" CASCADE;
  DROP TABLE "_pages_v_blocks_included_excluded_included_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_included_excluded_excluded" CASCADE;
  DROP TABLE "_pages_v_blocks_included_excluded_excluded_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_included_excluded" CASCADE;
  DROP TABLE "_pages_v_blocks_video_block" CASCADE;
  DROP TABLE "_pages_v_blocks_best_time_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_best_time_block" CASCADE;
  DROP TABLE "_pages_v_blocks_best_time_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block_questions" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block_questions_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_link_hubs_block_links" CASCADE;
  DROP TABLE "_pages_v_blocks_link_hubs_block_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_link_hubs_block" CASCADE;
  DROP TABLE "_pages_v_blocks_link_hubs_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_title_block" CASCADE;
  DROP TABLE "_pages_v_blocks_title_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_fact_chips_facts" CASCADE;
  DROP TABLE "_pages_v_blocks_fact_chips_facts_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_fact_chips" CASCADE;
  DROP TABLE "_pages_v_blocks_sticky_tabs_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_sticky_tabs_tabs_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_sticky_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_itinerary_days_meals" CASCADE;
  DROP TABLE "_pages_v_blocks_itinerary_days" CASCADE;
  DROP TABLE "_pages_v_blocks_itinerary_days_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_itinerary" CASCADE;
  DROP TABLE "_pages_v_blocks_overview" CASCADE;
  DROP TABLE "_pages_v_blocks_overview_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_accessibility_section" CASCADE;
  DROP TABLE "_pages_v_blocks_accessibility_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_reviews_block" CASCADE;
  DROP TABLE "_pages_v_blocks_reviews_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_booking_card" CASCADE;
  DROP TABLE "_pages_v_blocks_booking_card_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_similar_items" CASCADE;
  DROP TABLE "_pages_v_blocks_similar_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_departure_list" CASCADE;
  DROP TABLE "_pages_v_blocks_offer_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_author_box" CASCADE;
  DROP TABLE "_pages_v_blocks_author_box_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_group_discount_table_discounts" CASCADE;
  DROP TABLE "_pages_v_blocks_group_discount_table_discounts_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_group_discount_table" CASCADE;
  DROP TABLE "_pages_v_blocks_how_it_works_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_how_it_works_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_how_it_works" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_terms_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_terms_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_features_safety_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features_safety_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_features_safety" CASCADE;
  DROP TABLE "_pages_v_blocks_what_to_expect_items" CASCADE;
  DROP TABLE "_pages_v_blocks_what_to_expect_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_what_to_expect" CASCADE;
  DROP TABLE "_pages_v_blocks_specs_table_specs" CASCADE;
  DROP TABLE "_pages_v_blocks_specs_table_specs_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_specs_table" CASCADE;
  DROP TABLE "_pages_v_blocks_tours_using_vehicle" CASCADE;
  DROP TABLE "_pages_v_blocks_tours_using_vehicle_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_seat_map" CASCADE;
  DROP TABLE "_pages_v_blocks_seat_map_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_price_table_table_data_row" CASCADE;
  DROP TABLE "_pages_v_blocks_price_table_table_data_row_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_price_table_table_data" CASCADE;
  DROP TABLE "_pages_v_blocks_price_table" CASCADE;
  DROP TABLE "_pages_v_blocks_price_matrix" CASCADE;
  DROP TABLE "_pages_v_blocks_policy_block" CASCADE;
  DROP TABLE "_pages_v_blocks_policy_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tiles_categories" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tiles_categories_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tiles_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_tours" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_tours_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_destination_tiles_destinations" CASCADE;
  DROP TABLE "_pages_v_blocks_destination_tiles_destinations_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_destination_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_destination_tiles_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_social_feed_posts" CASCADE;
  DROP TABLE "_pages_v_blocks_social_feed" CASCADE;
  DROP TABLE "_pages_v_blocks_social_feed_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "tours_highlights" CASCADE;
  DROP TABLE "tours_highlights_locales" CASCADE;
  DROP TABLE "tours_itinerary_meals" CASCADE;
  DROP TABLE "tours_itinerary" CASCADE;
  DROP TABLE "tours_itinerary_locales" CASCADE;
  DROP TABLE "tours_included" CASCADE;
  DROP TABLE "tours_included_locales" CASCADE;
  DROP TABLE "tours_excluded" CASCADE;
  DROP TABLE "tours_excluded_locales" CASCADE;
  DROP TABLE "tours_pricing_matrix" CASCADE;
  DROP TABLE "tours_gallery" CASCADE;
  DROP TABLE "tours_gallery_locales" CASCADE;
  DROP TABLE "tours_videos" CASCADE;
  DROP TABLE "tours_videos_locales" CASCADE;
  DROP TABLE "tours_accessibility_features" CASCADE;
  DROP TABLE "tours_accessibility_features_locales" CASCADE;
  DROP TABLE "tours_best_time" CASCADE;
  DROP TABLE "tours_best_time_locales" CASCADE;
  DROP TABLE "tours_faq" CASCADE;
  DROP TABLE "tours_faq_locales" CASCADE;
  DROP TABLE "tours" CASCADE;
  DROP TABLE "tours_locales" CASCADE;
  DROP TABLE "tours_rels" CASCADE;
  DROP TABLE "vehicles_gallery" CASCADE;
  DROP TABLE "vehicles_features" CASCADE;
  DROP TABLE "vehicles_features_locales" CASCADE;
  DROP TABLE "vehicles_specs" CASCADE;
  DROP TABLE "vehicles_specs_locales" CASCADE;
  DROP TABLE "vehicles_rates" CASCADE;
  DROP TABLE "vehicles_rates_locales" CASCADE;
  DROP TABLE "vehicles" CASCADE;
  DROP TABLE "vehicles_locales" CASCADE;
  DROP TABLE "seasons" CASCADE;
  DROP TABLE "seasons_locales" CASCADE;
  DROP TABLE "offers_how_it_works" CASCADE;
  DROP TABLE "offers_how_it_works_locales" CASCADE;
  DROP TABLE "offers" CASCADE;
  DROP TABLE "offers_locales" CASCADE;
  DROP TABLE "offers_rels" CASCADE;
  DROP TABLE "hotels" CASCADE;
  DROP TABLE "hotels_locales" CASCADE;
  DROP TABLE "joint_departures" CASCADE;
  DROP TABLE "joint_departures_locales" CASCADE;
  DROP TABLE "destinations" CASCADE;
  DROP TABLE "destinations_locales" CASCADE;
  DROP TABLE "templates_sections" CASCADE;
  DROP TABLE "templates_sections_locales" CASCADE;
  DROP TABLE "templates_tabs" CASCADE;
  DROP TABLE "templates_tabs_locales" CASCADE;
  DROP TABLE "templates" CASCADE;
  DROP TABLE "gallery_items" CASCADE;
  DROP TABLE "gallery_items_locales" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_items_children" CASCADE;
  DROP TABLE "header_items_children_locales" CASCADE;
  DROP TABLE "header_items" CASCADE;
  DROP TABLE "header_items_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer_legal_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "site_settings_trust" CASCADE;
  DROP TABLE "site_settings_trust_locales" CASCADE;
  DROP TABLE "site_settings_payment_methods" CASCADE;
  DROP TABLE "site_settings_currencies" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "company_credentials" CASCADE;
  DROP TABLE "company_credentials_locales" CASCADE;
  DROP TABLE "company" CASCADE;
  DROP TABLE "company_locales" CASCADE;
  DROP TABLE "theme" CASCADE;
  DROP TABLE "routes_routes" CASCADE;
  DROP TABLE "routes_routes_locales" CASCADE;
  DROP TABLE "routes" CASCADE;
  DROP TABLE "translations_entries" CASCADE;
  DROP TABLE "translations_entries_locales" CASCADE;
  DROP TABLE "translations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_home_hero_slides_kind";
  DROP TYPE "public"."enum_pages_blocks_home_hero_slides_cta_route_key";
  DROP TYPE "public"."enum_pages_blocks_home_hero_slides_secondary_cta_route_key";
  DROP TYPE "public"."enum_pages_blocks_ways_to_travel_tiles_tone";
  DROP TYPE "public"."enum_pages_blocks_ways_to_travel_tiles_icon";
  DROP TYPE "public"."enum_pages_blocks_ways_to_travel_tiles_link_route_key";
  DROP TYPE "public"."enum_pages_blocks_tours_rail_source";
  DROP TYPE "public"."enum_pages_blocks_tours_rail_variant";
  DROP TYPE "public"."enum_pages_blocks_tours_rail_view_all_route_key";
  DROP TYPE "public"."enum_pages_blocks_offers_rail_view_all_route_key";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_cta_route_key";
  DROP TYPE "public"."enum_pages_blocks_rich_section_image_side";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_blocks_itinerary_days_meals";
  DROP TYPE "public"."enum_pages_blocks_booking_card_mode";
  DROP TYPE "public"."enum_pages_blocks_offer_banner_background_color";
  DROP TYPE "public"."enum_pages_blocks_price_matrix_mode";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_slides_kind";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_slides_cta_route_key";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_slides_secondary_cta_route_key";
  DROP TYPE "public"."enum__pages_v_blocks_ways_to_travel_tiles_tone";
  DROP TYPE "public"."enum__pages_v_blocks_ways_to_travel_tiles_icon";
  DROP TYPE "public"."enum__pages_v_blocks_ways_to_travel_tiles_link_route_key";
  DROP TYPE "public"."enum__pages_v_blocks_tours_rail_source";
  DROP TYPE "public"."enum__pages_v_blocks_tours_rail_variant";
  DROP TYPE "public"."enum__pages_v_blocks_tours_rail_view_all_route_key";
  DROP TYPE "public"."enum__pages_v_blocks_offers_rail_view_all_route_key";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_cta_route_key";
  DROP TYPE "public"."enum__pages_v_blocks_rich_section_image_side";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_itinerary_days_meals";
  DROP TYPE "public"."enum__pages_v_blocks_booking_card_mode";
  DROP TYPE "public"."enum__pages_v_blocks_offer_banner_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_price_matrix_mode";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_tours_itinerary_meals";
  DROP TYPE "public"."enum_tours_itinerary_mobility_level";
  DROP TYPE "public"."enum_tours_facts_pace";
  DROP TYPE "public"."enum_vehicles_type";
  DROP TYPE "public"."enum_offers_type";
  DROP TYPE "public"."enum_offers_discount_type";
  DROP TYPE "public"."enum_joint_departures_status";
  DROP TYPE "public"."enum_destinations_country";
  DROP TYPE "public"."enum_templates_sections_key";
  DROP TYPE "public"."enum_templates_tabs_key";
  DROP TYPE "public"."enum_templates_variant";
  DROP TYPE "public"."enum_gallery_items_type";
  DROP TYPE "public"."enum_inquiries_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_header_items_children_route_key";
  DROP TYPE "public"."enum_header_items_route_key";
  DROP TYPE "public"."enum_header_cta_route_key";
  DROP TYPE "public"."enum_footer_columns_links_route_key";
  DROP TYPE "public"."enum_footer_legal_links_route_key";
  DROP TYPE "public"."enum_site_settings_social_platform";
  DROP TYPE "public"."enum_routes_routes_key";`)
}

