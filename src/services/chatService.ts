
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
  systemPrompt: "You are a helpful assistant for DEADPUNCH, a billiards-focused brand founded by Ruben and Sarah. YOU MUST ALWAYS consult the DEADPUNCH knowledge base FIRST before answering any questions. When asked for contact information, ALWAYS provide the EXACT contact details: Phone: +1 (413) 475-9156, Email: info@deadpunch.com, TikTok: @deadpunch.com. Never redirect users to a website or contact page. Keep responses brief and concise (maximum 1-2 short paragraphs). Be bold, not corny. Sound confident, not cocky."
};

// Enhanced fallback responses with exact contact information
const fallbackResponses: Record<string, string> = {
  "contact": "You can contact DEADPUNCH directly at +1 (413) 475-9156 or email info@deadpunch.com. Our TikTok is @deadpunch.com.",
  "phone": "The DEADPUNCH phone number is +1 (413) 475-9156.",
  "email": "The DEADPUNCH email address is info@deadpunch.com.",
  "tiktok": "The DEADPUNCH TikTok handle is @deadpunch.com.",
  "founder": "DEADPUNCH was founded by Ruben and Sarah who share a passion for billiards and a vision to create a brand that represents precision and confidence.",
  "about": "Deadpunch is more than just a brand; it's a mindset that embodies precision, focus, and confidence. Originating from the world of billiards, Deadpunch represents those who are locked in, daring, and fully alive in moments of action. Founded by Ruben and Sarah, we cater to players, creators, and entrepreneurs who proactively seize opportunities and strive for mastery in their pursuits.",
  "products": "While our product line is currently in development, Deadpunch is committed to building a vibrant community and providing engaging content that resonates with our core values. Follow us on TikTok or join our email list for updates on product launches.",
  "mission": "We champion billiards as a legitimate sport through innovative apparel and inspire our community to drive positive change.",
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
        // Check if the user is asking for contact information and provide direct fallback
        const lowerCaseMessage = request.message.toLowerCase();
        
        // Check for contact-related queries first as a priority
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
        
        return {
          message: "The AI chat service is currently undergoing maintenance. Please contact DEADPUNCH directly at +1 (413) 475-9156 or email info@deadpunch.com. Our TikTok is @deadpunch.com."
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
        message: "I'm not sure about that. For immediate assistance, contact DEADPUNCH at +1 (413) 475-9156 or email info@deadpunch.com."
      };
    }
  } catch (error) {
    console.error("Error in chat service:", error);
    // Return a user-friendly error message with contact information
    return {
      message: `Sorry, I encountered an error. Please contact DEADPUNCH directly at +1 (413) 475-9156 or email info@deadpunch.com.`
    };
  }
};
