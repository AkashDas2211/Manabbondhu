/*
  # Fix infinite recursion in profiles RLS policies

  1. Problem
    - The "Admins can read all profiles" SELECT policy on `profiles` 
      queries the `profiles` table itself to check if the current user is admin.
      This causes infinite recursion because evaluating the policy triggers itself.

  2. Solution
    - Drop the recursive admin SELECT policy on `profiles`
    - Create a security definer function `is_admin()` that checks admin role
      without going through RLS (SECURITY DEFINER bypasses RLS)
    - Recreate the admin SELECT policy using `is_admin()` instead of a subquery
    - Also fix the same issue on `members` and `contact_messages` tables
    - Replace all admin-checking subqueries with `is_admin()` calls

  3. Security
    - The `is_admin()` function is SECURITY DEFINER, so it runs with the 
      function owner's privileges and bypasses RLS, avoiding recursion
    - The function only reads the role column for the current user's ID
*/

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Fix profiles table: drop and recreate admin policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

-- Fix members table: drop and recreate admin policies
DROP POLICY IF EXISTS "Admins can read all members" ON members;
DROP POLICY IF EXISTS "Admins can update members" ON members;
DROP POLICY IF EXISTS "Admins can delete members" ON members;

CREATE POLICY "Admins can read all members"
  ON members FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update members"
  ON members FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete members"
  ON members FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix contact_messages table: drop and recreate admin policies
DROP POLICY IF EXISTS "Admins can read all contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can delete contact messages" ON contact_messages;

CREATE POLICY "Admins can read all contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (is_admin());
