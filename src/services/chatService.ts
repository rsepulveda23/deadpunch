// This file handles the integration with OpenAI API via Supabase

import { supabase } from '@/lib/supabase';
import { ChatSettings } from '@/types/chat';

// Request type for chat messages
type ChatRequest = {
  message: string;
  model?: string;
  systemPrompt?: string;
};

// Response type from the API
type ChatResponse = {
  message: string;
};

// Default settings with updated knowledge base
export const defaultChatSettings: ChatSettings = {
  model: "gpt-4o-mini", // Default to gpt-4o-mini
  systemPrompt: "You are a helpful assistant for DEADPUNCH, a billiards-focused brand founded by Ruben and Sarah. Keep your responses brief and concise (maximum 1-2 short paragraphs). Embody a bold, authentic, and inspiring voice."
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

    // Use provided model and systemPrompt or fall back to defaults
    const model = request.model || defaultChatSettings.model;
    const systemPrompt = request.systemPrompt || defaultChatSettings.systemPrompt;

    console.log(`Using model: ${model}`);

    // Call the Supabase Edge Function that will handle the OpenAI API request
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        message: request.message,
        model,
        systemPrompt
      }
    });

    // Check for errors
    if (error) {
      console.error("Supabase Edge Function error:", error);
      
      // For development/testing when Edge Function might not be deployed yet
      if (error.message?.includes("Failed to send a request to the Edge Function")) {
        return {
          message: "The AI chat service is currently undergoing maintenance. Please try again later or contact support if the issue persists."
        };
      }
      
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
      message: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Failed to connect to AI service. Please try again later."}`
    };
  }
};
