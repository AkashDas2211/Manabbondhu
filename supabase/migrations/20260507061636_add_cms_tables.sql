/*
  # Add site content and gallery tables for CMS

  1. New Tables
    - `site_content`
      - `id` (uuid, primary key)
      - `section` (text, not null) - e.g. 'hero', 'about', 'stats', 'cta'
      - `key` (text, not null) - e.g. 'title', 'subtitle', 'description', 'stat_1_value'
      - `value` (text) - the content value
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - Unique constraint on (section, key)
    - `gallery_images`
      - `id` (uuid, primary key)
      - `section` (text, not null) - e.g. 'hero', 'about', 'services', 'gallery'
      - `url` (text, not null) - image URL
      - `alt` (text) - alt text
      - `caption` (text) - optional caption
      - `sort_order` (int, default 0) - for ordering
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Anyone can read (public website needs it)
    - Only admins can insert/update/delete

  3. Seed Data
    - Pre-populate site_content with default homepage content
    - Pre-populate gallery_images with default images
*/

-- Site content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert site content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update site content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete site content"
  ON site_content FOR DELETE
  TO authenticated
  USING (is_admin());

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  url text NOT NULL,
  alt text DEFAULT '',
  caption text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery images"
  ON gallery_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert gallery images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update gallery images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete gallery images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (is_admin());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_gallery_images_section ON gallery_images(section, sort_order);

-- Seed default site content
INSERT INTO site_content (section, key, value) VALUES
  -- Hero section
  ('hero', 'badge_text', '5+ Years of Service'),
  ('hero', 'title_line1', 'Together We'),
  ('hero', 'title_line2', 'Make a Difference'),
  ('hero', 'description', 'Manabbondhu NGO has been dedicated to serving communities through medical aid, nutritious food, educational materials, and hope for countless lives across West Bengal.'),
  ('hero', 'cta_primary_text', 'Join Us'),
  ('hero', 'cta_secondary_text', 'Learn More'),

  -- Stats section
  ('stats', 'stat_1_value', '5+'),
  ('stats', 'stat_1_label', 'Years of Service'),
  ('stats', 'stat_2_value', '1000+'),
  ('stats', 'stat_2_label', 'Lives Impacted'),
  ('stats', 'stat_3_value', '50+'),
  ('stats', 'stat_3_label', 'Volunteers'),
  ('stats', 'stat_4_value', '100+'),
  ('stats', 'stat_4_label', 'Events Organized'),

  -- About section
  ('about', 'subtitle', 'Who We Are'),
  ('about', 'title', 'A Community Built on Compassion'),
  ('about', 'paragraph_1', 'Manabbondhu NGO started as a humble initiative and has grown into a dedicated organization serving communities across West Bengal. Our mission is to provide essential support to those who need it most - from medical assistance to educational resources.'),
  ('about', 'paragraph_2', 'With over five transformative years of dedicated service, we have touched countless lives through our various programs and initiatives. Every member of our team shares a common vision: to create a better tomorrow for everyone.'),
  ('about', 'stat_badge_value', '5+'),
  ('about', 'stat_badge_label', 'Years of Impact'),

  -- CTA section
  ('cta', 'title', 'Ready to Make a Difference?'),
  ('cta', 'description', 'Join our growing family of volunteers and supporters. Together, we can bring hope and positive change to more lives.'),
  ('cta', 'button_primary_text', 'Become a Member'),
  ('cta', 'button_secondary_text', 'Contact Us'),

  -- Services section
  ('services', 'subtitle', 'What We Do'),
  ('services', 'title', 'Our Services'),
  ('services', 'description', 'We provide essential services to uplift communities and create lasting positive change.'),
  ('service_1', 'title', 'Medical Aid'),
  ('service_1', 'description', 'Providing essential medical assistance and healthcare support to underserved communities.'),
  ('service_2', 'title', 'Food Distribution'),
  ('service_2', 'description', 'Delivering nutritious food and meals to families and individuals in need.'),
  ('service_3', 'title', 'Education Support'),
  ('service_3', 'description', 'Supplying educational materials and resources to empower the next generation.')
ON CONFLICT (section, key) DO NOTHING;

-- Seed default gallery images
INSERT INTO gallery_images (section, url, alt, sort_order) VALUES
  ('about', 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800', 'Community service', 1),
  ('about', 'https://images.pexels.com/photos/6942083/pexels-photo-6942083.jpeg?auto=compress&cs=tinysrgb&w=400', 'Helping hands', 2),
  ('about', 'https://images.pexels.com/photos/6995187/pexels-photo-6995187.jpeg?auto=compress&cs=tinysrgb&w=400', 'Education support', 3),
  ('about', 'https://images.pexels.com/photos/6748448/pexels-photo-6748448.jpeg?auto=compress&cs=tinysrgb&w=400', 'Food distribution', 4)
ON CONFLICT DO NOTHING;
