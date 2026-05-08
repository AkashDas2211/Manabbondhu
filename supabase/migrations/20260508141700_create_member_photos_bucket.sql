/*
  # Create member-photos storage bucket

  1. Create public bucket for member photos
  2. Set up public access policy
*/

INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at)
VALUES (
  'member-photos',
  'member-photos',
  true,
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
