
-- Create function to call edge function when new email is added
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function with the new email
  PERFORM
    net.http_post(
      url := 'https://yunwcbujnowcifbkfjmr.supabase.co/functions/v1/send-welcome-email',
      body := json_build_object('email', NEW.email)::text,
      headers := '{"Content-Type": "application/json"}'
    );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE LOG 'Error calling welcome email function: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Create or replace the trigger on the email capture table
DROP TRIGGER IF EXISTS send_welcome_email_trigger ON public.deadpunch_email_capture;

CREATE TRIGGER send_welcome_email_trigger
AFTER INSERT ON public.deadpunch_email_capture
FOR EACH ROW
EXECUTE FUNCTION public.send_welcome_email_on_signup();

-- Grant necessary permission to execute the function
GRANT EXECUTE ON FUNCTION public.send_welcome_email_on_signup() TO postgres, anon, authenticated, service_role;
