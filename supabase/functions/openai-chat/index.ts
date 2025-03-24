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
What is Deadpunch?

Deadpunch is more than just a brand; it's a mindset that embodies precision, focus, and confidence. Originating from the world of billiards, Deadpunch represents those who are locked in, daring, and fully alive in moments of action. Founded by Ruben and Sarah, we cater to players, creators, and entrepreneurs who proactively seize opportunities and strive for mastery in their pursuits.

What features/services do you offer?

While our product line is currently in development, Deadpunch is committed to building a vibrant community and providing engaging content that resonates with our core values. Our offerings include:

- Engaging Content: Dynamic videos showcasing trick shots, behind-the-scenes moments, educational material, and live streams, primarily on platforms like TikTok.
- Community Engagement: Opportunities for our audience to participate in events, tournaments, and collaborative initiatives that celebrate the spirit of competition and creativity.

Pricing Information:
As our products are forthcoming, specific pricing details are not yet available. We are dedicated to offering high-quality items at competitive prices. For the latest updates on product launches and pricing, please follow us on our social media platforms or subscribe to our newsletter.

Frequently Asked Questions:
- When will Deadpunch products be available? We are working diligently to develop our product line and anticipate launching soon. Stay tuned to our official channels for announcements and release dates.
- How can I stay updated on Deadpunch news and releases? Follow us on TikTok and other social media platforms, and consider subscribing to our newsletter through our website to receive the latest updates.
- Can I collaborate with Deadpunch or contribute content? We welcome collaborations and community contributions. Please reach out to us via our contact page with your ideas or proposals.
- Will Deadpunch products be available internationally? We aim to make our products accessible to a global audience. Details on shipping and availability will be provided closer to our product launch.

Contact Information:
- TikTok: https://www.tiktok.com/@deadpunch.com
- Email: info@deadpunch.com

Brand Voice/Tone:
At Deadpunch, our communication embodies the following qualities:
- Authentic: We speak truthfully and transparently, fostering genuine connections with our community.
- Bold: Our tone is confident and assertive, reflecting the daring spirit of our brand.
- Engaging: We strive to captivate and involve our audience, encouraging active participation.
- Inspirational: We aim to motivate our community to pursue mastery and embrace challenges.
- Community-Centric: Our language fosters a sense of belonging, emphasizing collaboration and shared passion.

About the Founders:
Ruben and Sarah founded DEADPUNCH with a shared passion for billiards and a vision to create a brand that represents precision and confidence. They bring their expertise and enthusiasm to every aspect of the business.
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
    const defaultSystemPrompt = `You are a helpful assistant for DEADPUNCH, a billiards-focused brand founded by Ruben and Sarah. Keep responses brief and concise (1-2 short paragraphs maximum).

${knowledgeBase}

When answering questions:
1. Use the knowledge base provided above to give accurate information about DEADPUNCH
2. Always keep responses very concise and focused
3. Mention Ruben and Sarah as founders when relevant
4. If asked something outside your knowledge base, acknowledge it briefly and offer to help with what you do know about DEADPUNCH
5. Embody the Deadpunch brand voice: authentic, bold, engaging, inspirational, and community-centric
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
        max_tokens: 300  // Reduced from 500 to encourage shorter responses
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
