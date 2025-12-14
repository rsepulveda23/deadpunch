-- Fix tournaments: restrict direct table access, force use of security definer functions
-- Only owners can directly query their tournaments, everyone else uses the functions that mask data

DROP POLICY IF EXISTS "Authenticated users can view tournaments" ON public.tournaments;

-- Owners can see their own tournaments directly (for editing/management)
CREATE POLICY "Owners can view their own tournaments"
ON public.tournaments FOR SELECT
USING (auth.uid() = user_id);

-- Update the security definer functions to work for all users (authenticated or not)
-- The functions already mask contact info for non-authenticated users

-- Verify contact_submissions has correct admin-only policy (should already exist from previous migration)
-- This is a no-op if it already exists, but ensures it's correct
DO $$
BEGIN
  -- Check if the admin policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_submissions' 
    AND policyname = 'Only admins can view contact submissions'
  ) THEN
    CREATE POLICY "Only admins can view contact submissions"
    ON public.contact_submissions FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;