
/**
 * Motion Task Function
 *
 * This function is triggered when a new email capture event occurs.
 * It creates a Motion task to send a welcome email.
 */

// Define a custom Handler interface for our function
interface HandlerResponse {
  statusCode: number;
  body: string;
}

interface Handler {
  (event: { body: string | null }, context?: Record<string, unknown>): Promise<HandlerResponse>;
}

// Motion API configuration
const MOTION_API_ENDPOINT = 'https://api.usemotion.com/v1/tasks';
const MOTION_API_KEY = Deno.env.get("MOTION_API_KEY");

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handler: Handler = async (event, context) => {
  console.log("Motion task function triggered with event:", JSON.stringify(event));
  
  // Handle CORS preflight requests
  if (event && typeof event === 'object' && 'method' in event && event.method === 'OPTIONS') {
    return {
      statusCode: 204,
      body: '',
    };
  }
  
  try {
    // Check if MOTION_API_KEY is available
    if (!MOTION_API_KEY) {
      console.error("MOTION_API_KEY environment variable is not set");
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: "MOTION_API_KEY environment variable is not set",
          success: false
        }),
      };
    }

    // Parse the event body from Supabase's webhook or trigger payload
    const body = event.body ? JSON.parse(event.body) : {};
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
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'No email found in payload. Check the structure of your trigger data.',
          success: false
        }),
      };
    }

    console.log(`Processing record for email: ${email}, name: ${name}`);

    // Prepare the task payload for Motion
    const taskPayload = {
      title: `Send Welcome Email to ${name}`,
      description: `Please send a welcome email to ${name}. (Email: ${email})`,
      dueDate: new Date().toISOString(),
      status: "TODO",
      priority: "MEDIUM",
      // Adding metadata to help with tracking
      metadata: {
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
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: "Failed to create Motion task", 
          details: responseText,
          status: response.status,
          success: false
        }),
      };
    }

    // Parse the response as JSON if possible
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (error) {
      responseData = { raw: responseText };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Motion task created successfully', 
        data: responseData,
        success: true
      }),
    };
  } catch (error: unknown) {
    // Improved error handling
    console.error("Unexpected error in motion-task function:", error);
    
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: error.message,
          stack: error.stack,
          success: false
        }),
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An unknown error occurred',
        details: String(error),
        success: false
      }),
    };
  }
};
