CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp DEFAULT now(),
	"full_name" text NOT NULL,
	"company" text NOT NULL,
	"email" text NOT NULL,
	"industry" text,
	"data_problem" text NOT NULL,
	"decision_it_feeds" text,
	"referral" text,
	"status" text DEFAULT 'new',
	"notes" text DEFAULT ''
);
