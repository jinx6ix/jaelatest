import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "footer_partners" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "logo_id" integer NOT NULL,
      "url" varchar
    );

    CREATE TABLE IF NOT EXISTS "footer_partners_locales" (
      "name" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "footer_reviews" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "logo_id" integer NOT NULL,
      "url" varchar
    );

    CREATE TABLE IF NOT EXISTS "footer_reviews_locales" (
      "name" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "footer_partners_locales";
    DROP TABLE IF EXISTS "footer_partners";
    DROP TABLE IF EXISTS "footer_reviews_locales";
    DROP TABLE IF EXISTS "footer_reviews";
  `)
}
