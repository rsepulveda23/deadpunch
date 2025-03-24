
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

// Default settings
export const defaultChatSettings: ChatSettings = {
  model: "gpt-4o-mini", // Default to gpt-4o-mini
  systemPrompt: "You are a helpful assistant for DEADPUNCH, a futuristic sports platform. Be concise, knowledgeable, and helpful about this revolutionary AI-powered combat sports experience that combines advanced AI analysis, motion tracking, and immersive technology to create the ultimate combat sports training and entertainment system. DEADPUNCH offers real-time feedback, skill analysis, and personalized training programs for fighters of all levels."
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
          message: "The AI service is currently unavailable. Please deploy the 'openai-chat' Edge Function in your Supabase project and ensure your OpenAI API key is set as OPENAI_API_KEY in Supabase secrets."
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
