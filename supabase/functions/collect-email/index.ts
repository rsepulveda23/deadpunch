
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateEmailFormat, formatEmail } from "../_shared/utils.ts";

// Setup CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Request body interface
interface EmailRequest {
  email: string;
  metadata?: {
    source?: string;
    category?: string;
    subcategory?: string;
    timestamp?: string;
    [key: string]: any;
  };
}

// Response interface
interface EmailResponse {
  success: boolean;
  duplicate?: boolean;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log("[Edge Function] Email collection request received");
    
    // Create a Supabase client with the project details and service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[Edge Function] Missing Supabase credentials");
      throw new Error("Server configuration error");
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Parse request body
    let emailData: EmailRequest;
    try {
      emailData = await req.json();
    } catch (e) {
      console.error("[Edge Function] Error parsing request body:", e);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const { email: rawEmail, metadata = {} } = emailData;

    // Format the email properly
    const email = formatEmail(rawEmail);

    // Input validation
    if (!email) {
      console.error("[Edge Function] Missing email");
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Validate email format
    if (!validateEmailFormat(email)) {
      console.error("[Edge Function] Invalid email format:", email);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email format" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("[Edge Function] Checking for duplicate email:", email);
    
    // Check if email already exists in database
    const { data: existingEmails, error: lookupError } = await supabaseClient
      .from("deadpunch_email_capture")
      .select("email")
      .eq("email", email)
      .limit(1);

    if (lookupError) {
      console.error("[Edge Function] Database lookup error:", lookupError);
      throw lookupError;
    }

    // Check if this is a duplicate email
    const isDuplicate = existingEmails && existingEmails.length > 0;
    
    // If duplicate, we can return early with success but marked as duplicate
    if (isDuplicate) {
      console.log("[Edge Function] Duplicate email found:", email);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          duplicate: true 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("[Edge Function] Saving new email subscription:", email);

    // Prepare data for insertion
    const emailData2 = { 
      email, 
      created_at: new Date().toISOString(),
      metadata 
    };

    // Insert email into database
    const { error } = await supabaseClient
      .from("deadpunch_email_capture")
      .insert([emailData2]);

    if (error) {
      console.error("[Edge Function] Database error:", error);
      throw error;
    }

    console.log("[Edge Function] Email saved successfully:", email);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        duplicate: false
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("[Edge Function] Error:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
