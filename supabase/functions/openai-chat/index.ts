
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  message: string;
  model: string;
  systemPrompt: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Get OpenAI API key from environment variable
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in the environment variables')
    }

    // Parse request body
    const requestData: ChatMessage = await req.json()
    const { message, model = 'gpt-4o-mini', systemPrompt } = requestData

    // Validate required fields
    if (!message) {
      throw new Error('Message is required')
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: "system",
        content: systemPrompt || "You are a helpful assistant for DEADPUNCH, a futuristic sports platform. Be concise, knowledgeable, and helpful."
      },
      {
        role: "user",
        content: message
      }
    ]

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    })

    // Handle OpenAI API response
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json()
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
    }

    const data = await openAIResponse.json()
    const aiResponseText = data.choices[0].message.content

    // Return successful response
    return new Response(
      JSON.stringify({ response: aiResponseText }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})
