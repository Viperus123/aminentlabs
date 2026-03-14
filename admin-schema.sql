-- ========================================
-- AMINENT LABS — Admin Policies
-- Run this in Supabase SQL Editor AFTER the initial schema
-- ========================================

-- Allow admin to read ALL orders (by email)
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'support@aminentlabs.com'
  );

-- Allow admin to update ANY order (for status/tracking)
CREATE POLICY "Admin can update all orders"
  ON orders FOR UPDATE
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'support@aminentlabs.com'
  );

-- Drop the old select policy first (it conflicts)
-- Run these in order:
-- 1. DROP POLICY "Users can view own orders" ON orders;
-- 2. Then run the CREATE POLICY above

-- IMPORTANT: Run these commands in this order:
-- Step 1:
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- Step 2: (Already created above, but re-run for safety)
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'support@aminentlabs.com'
  );

DROP POLICY IF EXISTS "Admin can update all orders" ON orders;
CREATE POLICY "Admin can update all orders"
  ON orders FOR UPDATE
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'support@aminentlabs.com'
  );
