-- Add profiles table for storing user data synced from Clerk
CREATE TABLE IF NOT EXISTS "profiles" (
  "id" text PRIMARY KEY NOT NULL,
  "display_name" text,
  "email" text,
  "image_url" text,
  "country_code" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "profiles_country_code_idx" ON "profiles" ("country_code");

