
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { corsHeaders } from "../_shared/cors.ts";

interface ChatMessage {
  message: string;
  model: string;
  systemPrompt: string;
}

// DEADPUNCH knowledge base
const knowledgeBase = `
DEADPUNCH is a revolutionary AI-powered combat sports platform that combines:

1. Advanced Technology:
   - Motion tracking sensors that capture and analyze fighter movements in real-time
   - AI analysis algorithms that provide instant feedback on technique, power, and form
   - Immersive visualization technology for training and spectator experiences

2. Training Features:
   - Personalized training programs for all skill levels (beginner to professional)
   - Real-time feedback on punch technique, speed, power, and accuracy
   - Performance analytics with detailed metrics and improvement tracking
   - Virtual sparring partners with adjustable difficulty levels

3. Competition Elements:
   - Global leaderboards and ranking systems
   - Virtual tournaments and competitions
   - Match analysis and replay features with AI commentary
   - Social features for connecting with other fighters and coaches

4. Equipment:
   - Smart gloves with embedded sensors
   - Training pads and heavy bags with pressure sensors
   - Mobile and web applications for tracking progress
   - VR/AR integration for immersive training experiences

5. Benefits:
   - Injury prevention through proper technique analysis
   - Accelerated skill development with targeted feedback
   - Data-driven training optimization
   - Remote coaching possibilities
`;

Deno.serve(async (req) => {
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

    console.log(`Processing chat request with model: ${model}`)

    // Enhanced system prompt with knowledge base
    const defaultSystemPrompt = `You are a helpful assistant for DEADPUNCH, a futuristic sports platform. Be concise, knowledgeable, and helpful about this revolutionary AI-powered combat sports experience.

${knowledgeBase}

When answering questions:
1. Use the knowledge base provided above to give accurate information about DEADPUNCH
2. Be enthusiastic about the technology and its benefits
3. Keep responses concise and focused
4. If asked something outside your knowledge base, acknowledge it and offer to help with what you do know about DEADPUNCH
`;

    // Prepare messages for OpenAI
    const messages = [
      {
        role: "system",
        content: systemPrompt || defaultSystemPrompt
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
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
    }

    const data = await openAIResponse.json()
    const aiResponseText = data.choices[0].message.content

    console.log('Successfully received response from OpenAI')

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
