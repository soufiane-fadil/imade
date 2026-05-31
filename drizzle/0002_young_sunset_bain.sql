CREATE TYPE "public"."contact_reason" AS ENUM('article', 'error', 'qcm', 'other');--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "reason" "contact_reason" DEFAULT 'other' NOT NULL;