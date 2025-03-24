
// This file handles the integration with OpenAI API via Supabase

import { supabase } from '@/lib/supabase';

// Request type for chat messages
type ChatRequest = {
  message: string;
};

// Response type from the API
type ChatResponse = {
  message: string;
};

export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    console.log("Sending request to Supabase Edge Function...");
    
    // Check if Supabase is configured
    if (!supabase) {
      console.error("Supabase is not configured properly");
      return {
        message: "Error: Supabase connection is not available. Please check your configuration."
      };
    }

    // Call the Supabase Edge Function that will handle the OpenAI API request
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        message: request.message,
        model: "gpt-4o-mini",
        systemPrompt: "You are a helpful assistant for DEADPUNCH, a futuristic sports platform. Be concise, knowledgeable, and helpful."
      }
    });

    // Check for errors
    if (error) {
      console.error("Supabase Edge Function error:", error);
      throw new Error(`Supabase error: ${error.message || 'Unknown error'}`);
    }

    // If we get a successful response, return it
    if (data && data.response) {
      return {
        message: data.response
      };
    } else {
      // If the response format is unexpected
      console.error("Unexpected response format:", data);
      return {
        message: "Sorry, I received an unexpected response format. Please try again later."
      };
    }
  } catch (error) {
    console.error("Error in chat service:", error);
    // Return a user-friendly error message
    return {
      message: `Error: ${error instanceof Error ? error.message : "Failed to connect to AI service. Please try again later."}`
    };
  }
};
