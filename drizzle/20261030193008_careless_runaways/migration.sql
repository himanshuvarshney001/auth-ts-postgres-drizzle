ALTER TABLE "users" ADD COLUMN "refresh_token" varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL;