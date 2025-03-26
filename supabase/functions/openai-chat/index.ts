
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

Mission Statement:
We champion billiards as a legitimate sport through innovative apparel and inspire our community to drive positive change.

Vision Statement:
To set a new standard for quality and design in billiard apparel, and empower a passionate and united community of players, fans, and employees to advance the sport's growth and recognition.

Tagline:
Be precise. Be fearless. Be in Deadpunch.

What makes Deadpunch different?

Deadpunch isn't just slapping a logo on merch. It's about creating a culture—driven by community, built from the felt up. We don't copy the pros—we rep the players who grind, hustle, and win in silence. This is for the ones who stay locked in.

What features/services do you offer?

While our product line is currently in development, Deadpunch is committed to building a vibrant community and providing engaging content that resonates with our core values. Our offerings include:

- Engaging Content: Dynamic videos showcasing trick shots, behind-the-scenes moments, educational material, and live streams—primarily on TikTok.
- Community Engagement: Opportunities for our audience to participate in events, tournaments, and collaborative initiatives that celebrate the spirit of competition and creativity.

Where is Deadpunch headed?

We're starting in billiards—but the mindset applies everywhere. Over time, we'll expand into training, events, media, and other sports-driven arenas where performance and passion collide.

Early Access:

Want to be first in line? Drop your email to join the Deadpunch inner circle—get early access to gear, giveaways, and behind-the-scenes drops.

Pricing Information:

As our products are forthcoming, specific pricing details are not yet available. We are dedicated to offering high-quality items at competitive prices. For the latest updates on product launches and pricing, follow us on TikTok or join our email list.

Frequently Asked Questions:

- When will Deadpunch products be available?
We are working diligently to develop our product line and anticipate launching soon. Stay tuned to TikTok for announcements and release dates.

- How can I stay updated on Deadpunch news and releases?
Follow us on TikTok and subscribe to our newsletter to receive the latest updates.

- Can I collaborate with Deadpunch or contribute content?
We welcome collaborations and content ideas. Reach out by email or phone.

- Will Deadpunch products be available internationally?
We aim to make our products accessible to a global audience. Details on shipping and availability will be provided closer to launch.

Contact Information:

- TikTok: https://www.tiktok.com/@deadpunch.com
- Email: info@deadpunch.com
- Phone: +1 (413) 475-9156

Brand Voice/Tone:

At Deadpunch, our communication embodies the following qualities:
- Authentic: We speak truthfully and transparently, fostering genuine connections with our community.
- Bold: Our tone is confident and assertive, reflecting the daring spirit of our brand.
- Engaging: We strive to captivate and involve our audience, encouraging active participation.
- Inspirational: We aim to motivate our community to pursue mastery and embrace challenges.
- Community-Centric: Our language fosters a sense of belonging, emphasizing collaboration and shared passion.

About the Founders:

Ruben and Sarah founded DEADPUNCH with a shared passion for billiards and a vision to create a brand that represents precision and confidence. They bring their expertise and enthusiasm to every aspect of the business.

Mental Side of Pool and Sports Performance:

Deadpunch deeply understands the critical role mental focus plays in billiards and sports performance. Our philosophy encompasses:

- Mental Fortitude: Building resilience to handle pressure situations during competitive play
- Focus Techniques: Strategies to maintain concentration throughout extended matches
- Pre-shot Routines: Developing consistent mental preparation techniques
- Visualization: Using mental imagery to improve execution and confidence
- Emotional Control: Managing frustration, anxiety, and maintaining composure
- Flow State: Techniques to access optimal performance states where action and awareness merge
- Growth Mindset: Approaching challenges as opportunities for improvement
- Performance Psychology: Applying sports psychology principles to billiards and other competitive contexts
- Confidence Building: Practices to develop and maintain self-belief in high-pressure situations
- Mindfulness: Present-moment awareness techniques to enhance performance
- Mental Recovery: Strategies to bounce back from mistakes and losses
- Performance Goals: Setting effective process-focused goals rather than just outcome goals

Our approach integrates these mental aspects with technical skills, recognizing that peak performance comes from the synergy between mental clarity and physical execution.
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
      console.error('Missing OPENAI_API_KEY environment variable')
      throw new Error('OPENAI_API_KEY is not set in the environment variables')
    }

    // Parse request body
    const requestData: ChatMessage = await req.json()
    const { message, model = 'gpt-4o-mini', systemPrompt } = requestData

    // Validate required fields
    if (!message) {
      console.error('Missing required field: message')
      throw new Error('Message is required')
    }

    console.log(`Processing chat request with model: ${model}`)

    // Enhanced system prompt with stronger emphasis on knowledge base and contact info
    const defaultSystemPrompt = `You are a helpful assistant for DEADPUNCH, a billiards-focused brand founded by Ruben and Sarah.

CRITICAL INSTRUCTIONS: 
1. ALWAYS check the knowledge base FIRST for information.
2. When asked about contact information, ALWAYS provide the EXACT contact details without referring to a website or contact page:
   - Phone: +1 (413) 475-9156
   - Email: info@deadpunch.com
   - TikTok: @deadpunch.com

${knowledgeBase}

Additional response guidelines:
1. Keep responses brief and concise (1-2 short paragraphs maximum).
2. If someone asks how to contact DEADPUNCH, provide the phone, email and TikTok directly - DO NOT tell them to check a website.
3. Be bold and confident in your tone, but not cocky or arrogant.
4. If information is not in the knowledge base, clearly state you don't have those specific details.
5. Use punchy billiards language like "locked in," "clean hit," and "respect the grind" when appropriate.
`;

    // Check if the message is asking about contact information
    const lowerCaseMessage = message.toLowerCase();
    if (
      lowerCaseMessage.includes("contact") || 
      lowerCaseMessage.includes("reach") || 
      lowerCaseMessage.includes("phone") || 
      lowerCaseMessage.includes("email") || 
      lowerCaseMessage.includes("get in touch") ||
      lowerCaseMessage.includes("call")
    ) {
      // Direct response for contact-related queries
      return new Response(
        JSON.stringify({ 
          response: "You can contact DEADPUNCH directly at +1 (413) 475-9156 or email info@deadpunch.com. Our TikTok is @deadpunch.com." 
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

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
      // Avoid logging potentially sensitive error details
      console.error('OpenAI API error status:', openAIResponse.status)
      throw new Error(`OpenAI API error: ${openAIResponse.status}`)
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
    // Sanitize error logging - avoid logging the full error which might contain sensitive information
    console.error('Error processing request type:', error.name)
    
    // Return error response with contact information but without detailed error info
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request",
        response: "Sorry, I encountered an error. Please contact DEADPUNCH directly at +1 (413) 475-9156 or email info@deadpunch.com."
      }),
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
