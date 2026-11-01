import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_ai_crawlers" boolean DEFAULT true;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_preferred_source_enabled" boolean DEFAULT false;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_enabled" boolean DEFAULT false;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_merchant_id" varchar DEFAULT '5694347760';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_feed_enabled" boolean DEFAULT false;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_return_policy_category" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_return_policy_days" numeric;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_return_policy_refund_type" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_return_policy_fees" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_return_policy_method" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_return_policy_countries" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_return_policy_page_slug_id" integer;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_shipping_mode" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_shipping_rate" numeric;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_shipping_handling_days" numeric;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_shipping_transit_days" numeric;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_shipping_countries" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_shipping_page_slug_id" integer;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_store_quality_widget_enabled" boolean DEFAULT false;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_store_quality_position" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_store_quality_region" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_merchant_customer_reviews_opt_in_enabled" boolean DEFAULT false;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_ai_crawlers";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_preferred_source_enabled";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_enabled";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_merchant_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_feed_enabled";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_return_policy_category";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_return_policy_days";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_return_policy_refund_type";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_return_policy_fees";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_return_policy_method";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_return_policy_countries";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_return_policy_page_slug_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_shipping_mode";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "site_settings" DROP COLUMN IF EXISTS "seo_merchant_shipping_rate";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_shipping_handling_days";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_shipping_transit_days";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "site_settings" DROP COLUMN IF EXISTS "seo_merchant_shipping_countries";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_shipping_page_slug_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_store_quality_widget_enabled";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_store_quality_position";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_store_quality_region";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_merchant_customer_reviews_opt_in_enabled";
  `)
}
