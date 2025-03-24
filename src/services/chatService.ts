
// This file handles the integration with OpenAI API

// Request type for chat messages
type ChatRequest = {
  message: string;
};

// Response type from the API
type ChatResponse = {
  message: string;
};

// OpenAI API specific types
type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenAIRequest = {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
};

// Your API key - in a real production app, this would be stored securely on a backend
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // Replace with your actual API key

export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    // OpenAI API endpoint
    const endpoint = "https://api.openai.com/v1/chat/completions";
    
    // Format the request for OpenAI
    const openAIRequest: OpenAIRequest = {
      model: "gpt-4o-mini", // Using GPT-4o-mini model
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for DEADPUNCH, a futuristic sports platform. Be concise, knowledgeable, and helpful."
        },
        {
          role: "user",
          content: request.message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    console.log("Sending request to OpenAI API...");
    
    // Make the API call
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(openAIRequest)
    });

    // Check for successful response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    // Parse the response
    const data = await response.json();
    
    // Extract the message content from the response
    const responseMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
    return {
      message: responseMessage
    };
  } catch (error) {
    console.error("Error in chat service:", error);
    // Return a user-friendly error message
    return {
      message: `Error: ${error instanceof Error ? error.message : "Failed to connect to AI service. Please try again later."}`
    };
  }
};
