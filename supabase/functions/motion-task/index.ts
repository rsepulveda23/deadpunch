
/**
 * Motion Task Function
 *
 * This function is triggered when a new email capture event occurs.
 * It creates a Motion task to send a welcome email.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Motion API configuration
const MOTION_API_ENDPOINT = 'https://api.usemotion.com/v1/tasks';
const MOTION_API_KEY = Deno.env.get("Motion");

const handler = async (req: Request): Promise<Response> => {
  console.log("Motion task function triggered");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
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
    let reqText;
    
    try {
      reqText = await req.text();
      console.log("Raw request body:", reqText);
      body = reqText ? JSON.parse(reqText) : {};
    } catch (error) {
      console.error("Error parsing request body:", error);
      body = {};
    }
    
    console.log("Received payload:", JSON.stringify(body));
    
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
          payload: body,
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

    // Prepare the task payload for Motion according to their API documentation
    const taskPayload = {
      name: `Send Welcome Email to ${name}`,
      description: `Please send a welcome email to ${name}. (Email: ${email})`,
      dueDate: new Date().toISOString(),
      priority: "MEDIUM", // Options: HIGH, MEDIUM, LOW
      status: "NOT_STARTED", // Options: NOT_STARTED, IN_PROGRESS, COMPLETED
      // Optional fields
      isPrivate: false,
      // Adding metadata as a custom field since it's not part of the standard API
      customFields: {
        source: "deadpunch_email_capture",
        sourceEmail: email,
        timestamp: new Date().toISOString()
      }
    };

    console.log("Sending request to Motion API:", JSON.stringify(taskPayload));

    // Make the API request to Motion
    const response = await fetch(MOTION_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOTION_API_KEY}`,
      },
      body: JSON.stringify(taskPayload),
    });

    // Get response text for logging
    const responseText = await response.text();
    console.log(`Motion API response status: ${response.status}`);
    console.log(`Motion API response body: ${responseText}`);

    // Check for a successful response
    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to create Motion task", 
          details: responseText,
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
        data: responseData,
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
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        stack: errorStack,
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
