-- ==============================================================================
-- IBN BASHEER ACADEMY — INSTRUCTOR ONBOARDING SCRIPT
-- ==============================================================================
-- Use this SQL script in the Supabase SQL Editor to:
-- 1. Promote an existing registered user to 'teacher' or 'admin'.
-- 2. Verify faculty member accounts and check assigned roles.
-- ==============================================================================

-- 1. PROMOTE EXISTING USER BY EMAIL
-- Replace 'instructor@example.com' with the faculty member's actual email address.
UPDATE public.profiles
SET 
  role = 'teacher',
  full_name = 'Ustadh Numon Basheer (Abu Abdullah)',
  updated_at = NOW()
WHERE email = 'instructor@example.com';

-- 2. PROMOTE TO ACADEMY ADMIN (IF NEEDED)
-- Admins have full access across both student records and faculty workbenches.
-- UPDATE public.profiles
-- SET role = 'admin', updated_at = NOW()
-- WHERE email = 'admin@ibnbasheer.edu';

-- 3. VERIFY ACTIVE FACULTY MEMBERS
-- Run this query to inspect all current instructors and their profiles.
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
FROM public.profiles
WHERE role IN ('teacher', 'admin')
ORDER BY role, full_name;
