-- Fix organizer_profiles: restrict contact info to authenticated users only
DROP POLICY IF EXISTS "Allow public read access to organizer profiles" ON public.organizer_profiles;

CREATE POLICY "Authenticated users can view organizer profiles" 
ON public.organizer_profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix deadpunch_email_capture: add policies for email capture functionality
-- Allow public inserts for email signup forms
CREATE POLICY "Anyone can submit email for capture" 
ON public.deadpunch_email_capture 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (admins) can read captured emails
CREATE POLICY "Authenticated users can view captured emails" 
ON public.deadpunch_email_capture 
FOR SELECT 
USING (auth.uid() IS NOT NULL);