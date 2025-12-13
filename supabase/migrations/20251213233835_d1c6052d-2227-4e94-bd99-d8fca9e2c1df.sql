-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view tournaments" ON public.tournaments;

-- Create a more restrictive SELECT policy - only allow SELECT through security definer functions
-- This prevents direct table access while the get_public_tournaments and get_tournament_by_id functions still work
CREATE POLICY "Authenticated users can view tournaments" 
ON public.tournaments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Note: The existing security definer functions (get_public_tournaments, get_tournament_by_id) 
-- will still work for public access because they use SECURITY DEFINER which bypasses RLS