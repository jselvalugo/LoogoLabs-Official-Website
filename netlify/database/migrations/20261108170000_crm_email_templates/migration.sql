-- Email blasts from coded templates (netlify/lib/email-templates/).
--   crm_email_campaigns.template  the template id; NULL for written campaigns.
-- A blast's content comes only from its template, never from the editor; its
-- audience is the list uploaded for it, held as an auto-generated tag.
ALTER TABLE "crm_email_campaigns" ADD COLUMN IF NOT EXISTS "template" text;
