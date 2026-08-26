CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"title" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"excerpt" text DEFAULT '',
	"content" text NOT NULL DEFAULT '',
	"tags" text DEFAULT '',
	"status" text DEFAULT 'draft',
	"views" integer DEFAULT 0,
	"author" text DEFAULT 'Loogo Labs',
	"read_time" integer DEFAULT 5,
	"published_at" timestamp
);
