
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

export const handler: Handler = async (event, context) => {
  try {
    console.log("Motion task function triggered");
    
    // Check if MOTION_API_KEY is available
    if (!MOTION_API_KEY) {
      console.error("MOTION_API_KEY environment variable is not set");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "MOTION_API_KEY environment variable is not set" }),
      };
    }

    // Parse the event body from Supabase's webhook or trigger payload
    const body = event.body ? JSON.parse(event.body) : {};
    console.log("Received payload:", JSON.stringify(body));
    
    // Assume the new record is under body.record or body.payload.new
    const record = body.record || (body.payload && body.payload.new) || null;
    if (!record) {
      console.error("No record found in event payload:", JSON.stringify(body));
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No record found in event payload. Expected "record" or "payload.new" property.' }),
      };
    }

    // Extract email and name; if name is not provided, default to email
    const email: string = record.email;
    const name: string = record.name || email;

    if (!email) {
      console.error("No email found in record:", JSON.stringify(record));
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No email found in record' }),
      };
    }

    console.log(`Processing record for email: ${email}`);

    // Prepare the task payload for Motion
    const taskPayload = {
      title: "Send Welcome Email",
      description: `Please send a welcome email to ${name}. (Email: ${email})`,
      dueDate: new Date().toISOString(), // setting as ASAP (current time)
      status: "TODO",
      priority: "MEDIUM"
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

    // Check for a successful response
    const responseText = await response.text();
    console.log(`Motion API response status: ${response.status}`);
    console.log(`Motion API response body: ${responseText}`);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: "Failed to create Motion task", 
          details: responseText,
          status: response.status 
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
        data: responseData 
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
          stack: error.stack
        }),
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An unknown error occurred',
        details: String(error)
      }),
    };
  }
};
