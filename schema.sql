-- ========================================
-- AMINENT LABS — Supabase Schema
-- Run in Supabase SQL Editor
-- ========================================

-- Orders table (for checkout submissions)
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending',
  items jsonb NOT NULL,
  subtotal numeric(10,2),
  shipping numeric(10,2) DEFAULT 0,
  total numeric(10,2),
  shipping_name text,
  shipping_email text,
  shipping_address text,
  shipping_city text,
  shipping_state text,
  shipping_zip text,
  shipping_country text DEFAULT 'US',
  notes text
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own orders" ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  organization text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new'
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated) can submit contact form
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only admin can read submissions
CREATE POLICY "Admin can view contact submissions" ON contact_submissions FOR SELECT
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'support@aminentlabs.com'
  );

-- Bulk order requests
CREATE TABLE IF NOT EXISTS bulk_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  organization text NOT NULL,
  org_type text,
  qty_glp3rt text DEFAULT '0',
  qty_bpc157 text DEFAULT '0',
  qty_ghkcu text DEFAULT '0',
  po_number text,
  notes text,
  status text DEFAULT 'new'
);

ALTER TABLE bulk_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit bulk order" ON bulk_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can view bulk orders" ON bulk_orders FOR SELECT
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'support@aminentlabs.com'
  );

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  email text UNIQUE NOT NULL
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);
