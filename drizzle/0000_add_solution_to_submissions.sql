CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"difficulty" text NOT NULL,
	"description" text NOT NULL,
	"details" text NOT NULL,
	"hint" text NOT NULL,
	"success_message" text NOT NULL,
	"example" jsonb NOT NULL,
	"validation" jsonb NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"exercise_id" uuid NOT NULL,
	"score" integer DEFAULT 2 NOT NULL,
	"solution" text,
	"feedback" text,
	"attempts" integer DEFAULT 1 NOT NULL,
	"time_spent_seconds" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;