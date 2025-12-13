-- Create a security definer function to get tournaments with filtered contact info for anonymous users
CREATE OR REPLACE FUNCTION public.get_public_tournaments()
RETURNS TABLE (
  id uuid,
  name text,
  tournament_date date,
  tournament_time time without time zone,
  location_name text,
  address text,
  city text,
  state text,
  zip_code text,
  game_type text,
  entry_fee numeric,
  prize_pool text,
  description text,
  website_link text,
  flyer_image_url text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz,
  user_id uuid,
  organizer_name text,
  organizer_email text,
  organizer_phone text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      t.id, t.name, t.date, t.time, t.location_name, t.address,
      t.city, t.state, t.zip_code, t.game_type, t.entry_fee,
      t.prize_pool, t.description, t.website_link, t.flyer_image_url,
      t.latitude, t.longitude, t.created_at, t.user_id,
      t.organizer_name, t.organizer_email, t.organizer_phone
    FROM tournaments t
    ORDER BY t.date ASC;
  ELSE
    RETURN QUERY
    SELECT 
      t.id, t.name, t.date, t.time, t.location_name, t.address,
      t.city, t.state, t.zip_code, t.game_type, t.entry_fee,
      t.prize_pool, t.description, t.website_link, t.flyer_image_url,
      t.latitude, t.longitude, t.created_at, t.user_id,
      t.organizer_name,
      '(Sign in to view)'::text AS organizer_email,
      '(Sign in to view)'::text AS organizer_phone
    FROM tournaments t
    ORDER BY t.date ASC;
  END IF;
END;
$$;

-- Create function to get single tournament with same logic
CREATE OR REPLACE FUNCTION public.get_tournament_by_id(tournament_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  tournament_date date,
  tournament_time time without time zone,
  location_name text,
  address text,
  city text,
  state text,
  zip_code text,
  game_type text,
  entry_fee numeric,
  prize_pool text,
  description text,
  website_link text,
  flyer_image_url text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz,
  user_id uuid,
  organizer_name text,
  organizer_email text,
  organizer_phone text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      t.id, t.name, t.date, t.time, t.location_name, t.address,
      t.city, t.state, t.zip_code, t.game_type, t.entry_fee,
      t.prize_pool, t.description, t.website_link, t.flyer_image_url,
      t.latitude, t.longitude, t.created_at, t.user_id,
      t.organizer_name, t.organizer_email, t.organizer_phone
    FROM tournaments t
    WHERE t.id = tournament_id;
  ELSE
    RETURN QUERY
    SELECT 
      t.id, t.name, t.date, t.time, t.location_name, t.address,
      t.city, t.state, t.zip_code, t.game_type, t.entry_fee,
      t.prize_pool, t.description, t.website_link, t.flyer_image_url,
      t.latitude, t.longitude, t.created_at, t.user_id,
      t.organizer_name,
      '(Sign in to view)'::text AS organizer_email,
      '(Sign in to view)'::text AS organizer_phone
    FROM tournaments t
    WHERE t.id = tournament_id;
  END IF;
END;
$$;