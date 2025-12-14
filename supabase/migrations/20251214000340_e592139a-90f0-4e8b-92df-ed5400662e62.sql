-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Only admins can view user roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update leads table: only admins can read
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
CREATE POLICY "Only admins can view leads"
ON public.leads FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update deadpunch_email_capture: only admins can read
DROP POLICY IF EXISTS "Authenticated users can view captured emails" ON public.deadpunch_email_capture;
CREATE POLICY "Only admins can view captured emails"
ON public.deadpunch_email_capture FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update contact_submissions: admins can read (fix the 'false' policy)
DROP POLICY IF EXISTS "Only authenticated users can read submissions" ON public.contact_submissions;
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));