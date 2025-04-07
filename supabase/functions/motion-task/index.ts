
/**
 * Motion Task Function
 *
 * This function is triggered when a new email capture event occurs.
 * It creates a Motion task to send a welcome email.
 *
 * Ensure that the environment variable MOTION_API_KEY is set with your Motion API key.
 */

// Using global fetch available in Node 18+
// Define a custom Handler interface for our function

interface HandlerResponse {
  statusCode: number;
  body: string;
}

interface Handler {
  (event: { body: string | null }, context?: Record<string, unknown>): Promise<HandlerResponse>;
}

const MOTION_API_ENDPOINT = 'https://api.usemotion.com/v1/tasks'; // Replace with the actual Motion API endpoint
const MOTION_API_KEY = Deno.env.get("MOTION_API_KEY");

export const handler: Handler = async (event, context) => {
  try {
    // Parse the event body from Supabase's webhook or trigger payload
    const body = event.body ? JSON.parse(event.body) : {};
    // Assume the new record is under body.payload.new
    const record = body.payload && body.payload.new ? body.payload.new : null;
    if (!record) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No record found in event payload.' }),
      };
    }

    // Extract email and name; if name is not provided, default to email
    const email: string = record.email;
    const name: string = record.name || email;

    // Prepare the task payload for Motion
    const taskPayload = {
      title: "Send Welcome Email",
      description: `Please send a welcome email to ${name}. (Email: ${email})`,
      dueDate: new Date().toISOString(), // setting as ASAP (current time); adjust as needed
    };

    // Check if MOTION_API_KEY is available
    if (!MOTION_API_KEY) {
      console.error("MOTION_API_KEY environment variable is not set");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "MOTION_API_KEY environment variable is not set" }),
      };
    }

    const response = await fetch(MOTION_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOTION_API_KEY}`,
      },
      body: JSON.stringify(taskPayload),
    });

    // Check for a successful response
    if (!response.ok) {
      const errorData = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to create Motion task", details: errorData }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Motion task created successfully', data }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An unknown error occurred' }),
    };
  }
};
