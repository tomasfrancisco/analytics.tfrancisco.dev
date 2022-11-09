-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT IF EXISTS "event_session_id_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT IF EXISTS "event_website_id_fkey";

-- DropForeignKey
ALTER TABLE "pageview" DROP CONSTRAINT IF EXISTS "pageview_session_id_fkey";

-- DropForeignKey
ALTER TABLE "pageview" DROP CONSTRAINT IF EXISTS "pageview_website_id_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_website_id_fkey";

-- DropForeignKey
ALTER TABLE "website" DROP CONSTRAINT IF EXISTS "website_user_id_fkey";