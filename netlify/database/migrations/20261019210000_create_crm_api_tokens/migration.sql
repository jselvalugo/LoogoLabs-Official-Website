-- Access tokens for the "Loogo Labs CRM" MCP server (/mcp). Each token belongs
-- to one CRM instance and can only touch that instance's data. Only a SHA-256
-- of the token is stored; it is shown once, when created in /admin.
CREATE TABLE IF NOT EXISTS "crm_api_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"instance_id" uuid NOT NULL REFERENCES "crm_instances" ("id") ON DELETE CASCADE,
	"name" text NOT NULL DEFAULT '',
	"token_hash" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now(),
	"last_used_at" timestamp
);

-- Notes written through the MCP have no CRM user; this records who wrote them.
ALTER TABLE "crm_notes" ADD COLUMN IF NOT EXISTS "author_label" text;
