
/**
 * Chat Service
 * 
 * This file handles the integration with OpenAI API via Supabase Edge Functions.
 * It provides the interface between the frontend chat components and the backend AI services.
 */

import { supabase } from '@/integrations/supabase/client';
import { ChatSettings } from '@/types/chat';

/**
 * Request type for chat messages sent to the API
 * @typedef {Object} ChatRequest
 * @property {string} message - The user's input message
 * @property {string} [model] - Optional AI model to use
 * @property {string} [systemPrompt] - Optional system prompt to override default
 */
type ChatRequest = {
  message: string;
  model?: string;
  systemPrompt?: string;
};

/**
 * Response type from the chat API
 * @typedef {Object} ChatResponse
 * @property {string} message - The AI's response message
 */
type ChatResponse = {
  message: string;
};

/**
 * Default settings for the chat interface with preconfigured values
 * These settings determine how the AI responds by default
 * @constant
 */
export const defaultChatSettings: ChatSettings = {
  model: "gpt-4o-mini", // Default to gpt-4o-mini for balance of speed and quality
  systemPrompt: "You are a helpful assistant for DEADPUNCH, a billiards-focused brand founded by Ruben. YOU MUST ALWAYS consult the DEADPUNCH knowledge base FIRST before answering any questions. When asked for contact information, ALWAYS provide the EXACT contact details: Phone: +1 (413) 475-9156, Email: info@deadpunch.com, TikTok: @deadpunch.com. Never redirect users to a website or contact page. Keep responses brief and concise (maximum 1-2 short paragraphs). Be bold, not corny. Sound confident, not cocky."
};

/**
 * Fallback responses for common queries when Edge Function is unavailable
 * Provides consistent answers for important information even when backend is down
 * @constant
 */
const fallbackResponses: Record<string, string> = {
  "contact": "You can contact DEADPUNCH directly at +1 (413) 475-9156 or email info@deadpunch.com. Our TikTok is @deadpunch.com.",
  "phone": "The DEADPUNCH phone number is +1 (413) 475-9156.",
  "email": "The DEADPUNCH email address is info@deadpunch.com.",
  "tiktok": "The DEADPUNCH TikTok handle is @deadpunch.com.",
  "founder": "DEADPUNCH was founded by Ruben who shares a passion for billiards and a vision to create a brand that represents precision and confidence.",
  "about": "Deadpunch is more than just a brand; it's a mindset that embodies precision, focus, and confidence. Originating from the world of billiards, Deadpunch represents those who are locked in, daring, and fully alive in moments of action. Founded by Ruben, we cater to players, creators, and entrepreneurs who proactively seize opportunities and strive for mastery in their pursuits.",
  "products": "While our product line is currently in development, Deadpunch is committed to building a vibrant community and providing engaging content that resonates with our core values. Follow us on TikTok or join our email list for updates on product launches.",
  "mission": "We champion billiards as a legitimate sport through innovative apparel and inspire our community to drive positive change.",
};

/**
 * Main function to send a chat message to the AI
 * Handles API communication, error states, and fallbacks
 * 
 * @param {ChatRequest} request - The chat request with user message and options
 * @returns {Promise<ChatResponse>} Promise resolving to the AI's response
 */
export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    console.log("Sending request to Supabase Edge Function...");
    
    // Check if Supabase is configured correctly
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

    // Call the Supabase Edge Function that handles the OpenAI API request
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        message: request.message,
        model,
        systemPrompt
      }
    });

    // Check for errors from Supabase Edge Function
    if (error) {
      console.error("Supabase Edge Function error:", error);
      
      // For development/testing when Edge Function might not be deployed yet
      // Provides graceful fallback with useful responses
      if (error.message?.includes("Failed to send a request to the Edge Function")) {
        // Check if the user is asking for contact information and provide direct fallback
        const lowerCaseMessage = request.message.toLowerCase();
        
        // First priority: Check for contact-related queries
        if (lowerCaseMessage.includes("contact") || lowerCaseMessage.includes("reach") || 
            lowerCaseMessage.includes("get in touch") || lowerCaseMessage.includes("talk to")) {
          return {
            message: fallbackResponses.contact
          };
        } else if (lowerCaseMessage.includes("phone") || lowerCaseMessage.includes("call") || 
                  lowerCaseMessage.includes("number")) {
          return {
            message: fallbackResponses.phone
          };
        } else if (lowerCaseMessage.includes("email") || lowerCaseMessage.includes("mail") || 
                  lowerCaseMessage.includes("send message")) {
          return {
            message: fallbackResponses.email
          };
        } else if (lowerCaseMessage.includes("tiktok") || lowerCaseMessage.includes("social") || 
                  lowerCaseMessage.includes("social media")) {
          return {
            message: fallbackResponses.tiktok
          };
        } else if (lowerCaseMessage.includes("founder") || lowerCaseMessage.includes("ruben") || 
                  lowerCaseMessage.includes("sarah") || lowerCaseMessage.includes("who started")) {
          return {
            message: fallbackResponses.founder
          };
        } else if (lowerCaseMessage.includes("what is") || lowerCaseMessage.includes("about") || 
                  lowerCaseMessage.includes("tell me about")) {
          return {
            message: fallbackResponses.about
          };
        } else if (lowerCaseMessage.includes("product") || lowerCaseMessage.includes("offer") || 
                  lowerCaseMessage.includes("merchandise") || lowerCaseMessage.includes("buy")) {
          return {
            message: fallbackResponses.products
          };
        } else if (lowerCaseMessage.includes("mission") || lowerCaseMessage.includes("goal") || 
                  lowerCaseMessage.includes("purpose")) {
          return {
            message: fallbackResponses.mission
          };
        }
        
        // Generic maintenance message for all other queries
        return {
          message: "The AI chat service is currently undergoing maintenance. Please contact DEADPUNCH directly at +1 (413) 475-9156 or email info@deadpunch.com. Our TikTok is @deadpunch.com."
        };
      }
      
      throw new Error(`Supabase error: ${error.message || 'Unknown error'}`);
    }

    // Process successful response from the Edge Function
    if (data && data.response) {
      return {
        message: data.response
      };
    } else {
      // Handle unexpected response format
      console.error("Unexpected response format:", data);
      return {
        message: "I'm not sure about that. For immediate assistance, contact DEADPUNCH directly at +1 (413) 475-9156 or email info@deadpunch.com."
      };
    }
  } catch (error) {
    // Handle any other errors that might occur
    console.error("Error in chat service:", error);
    // Always return a user-friendly error message with contact information
    return {
      message: `Sorry, I encountered an error. Please contact DEADPUNCH directly at +1 (413) 475-9156 or email info@deadpunch.com.`
    };
  }
};
