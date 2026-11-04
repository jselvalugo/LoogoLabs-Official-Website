-- One row per paid marketplace order whose download link was emailed to the buyer,
-- so skill-order.js sends that email exactly once.
CREATE TABLE IF NOT EXISTS "skill_order_emails" (
	"session_id" text PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"email" text NOT NULL,
	"sent_at" timestamp DEFAULT now()
);
