/**
 * Motion Task Function
 *
 * This function is triggered when a new email capture event occurs.
 * It creates a Motion task to send a welcome email.
 * 
 * SECURITY: This function accepts requests from:
 * 1. Authenticated users (via JWT)
 * 2. Internal webhook triggers (validated via webhook secret)
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Motion API configuration
const MOTION_API_ENDPOINT = 'https://api.usemotion.com/v1/tasks';
const MOTION_API_KEY = Deno.env.get("Motion");
// Get the workspace ID from environment variables
const MOTION_WORKSPACE_ID = Deno.env.get("MOTION_WORKSPACE_ID") || "default";

/**
 * Verify user authentication or webhook secret
 */
async function verifyAuth(req: Request): Promise<{ authenticated: boolean; isWebhook: boolean; userId?: string }> {
  // Check for webhook secret header (for database triggers)
  const webhookSecret = req.headers.get('x-webhook-secret');
  const expectedSecret = Deno.env.get('WEBHOOK_SECRET');
  
  if (webhookSecret && expectedSecret && webhookSecret === expectedSecret) {
    console.log('Webhook authentication verified');
    return { authenticated: true, isWebhook: true };
  }

  // Check for user JWT authentication
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    console.log('No authorization header provided');
    return { authenticated: false, isWebhook: false };
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.log('Auth verification failed:', error?.message || 'No user found');
      return { authenticated: false, isWebhook: false };
    }

    console.log('User authenticated:', user.id);
    return { authenticated: true, isWebhook: false, userId: user.id };
  } catch (error) {
    console.error('Error verifying auth:', error);
    return { authenticated: false, isWebhook: false };
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Motion task function triggered");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Verify authentication
  const auth = await verifyAuth(req);
  if (!auth.authenticated) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized', success: false }),
      { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  try {
    // Check if MOTION_API_KEY is available
    if (!MOTION_API_KEY) {
      console.error("Motion API key environment variable is not set");
      return new Response(
        JSON.stringify({ 
          error: "Motion API key environment variable is not set",
          success: false
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Parse the request body
    let body;
    
    try {
      body = await req.json();
      console.log("Received payload:", JSON.stringify(body));
    } catch (error) {
      console.error("Error parsing request body:", error);
      body = {};
    }
    
    // Check different possible locations for the email data
    // This makes the function more robust to different trigger sources
    let email = '';
    let name = '';
    
    // Try to extract data from different possible payload structures
    if (body.record) {
      // Direct webhook format
      email = body.record.email;
      name = body.record.name || body.record.metadata?.name || email;
    } else if (body.payload && body.payload.new) {
      // Database trigger format
      email = body.payload.new.email;
      name = body.payload.new.name || body.payload.new.metadata?.name || email;
    } else if (body.email) {
      // Direct API call format
      email = body.email;
      name = body.name || body.metadata?.name || email;
    }
    
    // Validate we have the minimum required data
    if (!email) {
      console.error("No email found in payload:", JSON.stringify(body));
      return new Response(
        JSON.stringify({ 
          error: 'No email found in payload. Check the structure of your trigger data.',
          success: false
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid email format',
          success: false
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    console.log(`Processing record for email: ${email}, name: ${name}`);

    // Create a task payload according to Motion API documentation
    // Including the required workspaceId parameter
    const taskPayload = {
      name: `Send Welcome Email to ${name}`,
      description: `Please send a welcome email to ${name}. Email: ${email}`,
      dueDate: new Date().toISOString(),
      priority: "MEDIUM",
      status: "NOT_STARTED",
      workspaceId: MOTION_WORKSPACE_ID, // Add the required workspaceId parameter
    };

    console.log("Sending request to Motion API");

    // Make the API request to Motion with the correct X-API-Key header
    const response = await fetch(MOTION_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MOTION_API_KEY,
      },
      body: JSON.stringify(taskPayload),
    });

    // Get response text for logging
    const responseText = await response.text();
    console.log(`Motion API response status: ${response.status}`);

    // Check for a successful response
    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to create Motion task", 
          status: response.status,
          success: false
        }),
        {
          status: response.status,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Parse the response as JSON if possible
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (error) {
      responseData = { raw: responseText };
    }

    return new Response(
      JSON.stringify({ 
        message: 'Motion task created successfully', 
        success: true
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error: unknown) {
    // Improved error handling
    console.error("Unexpected error in motion-task function:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: "An internal error occurred",
        success: false
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

// Start the server
serve(handler);