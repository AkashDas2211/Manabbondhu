/*
  # Add photo column to members table

  1. Changes
    - Add `photo_url` column to members table for storing member profile photos
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'members' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE members ADD COLUMN photo_url text DEFAULT '';
  END IF;
END $$;
