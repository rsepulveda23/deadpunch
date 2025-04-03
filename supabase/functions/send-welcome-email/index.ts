
// Supabase Edge Function: send-welcome-email
// Sends a welcome email to new subscribers when triggered by database events

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Email configuration
const SENDER_EMAIL = "info@deadpunch.com";
const APPLE_SMTP_HOST = "smtp.mail.me.com";
const APPLE_SMTP_PORT = 587;

// Welcome email template - HTML version
function getWelcomeEmailHTML(logoUrl: string, toolsUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Deadpunch</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header img {
          max-width: 180px;
          margin-bottom: 15px;
        }
        h1 {
          font-size: 24px;
          margin: 0;
          padding: 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #d41920;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Deadpunch Logo">
        </div>
        
        <p><strong>You're in.</strong></p>
        
        <p>Welcome to Deadpunch — where it's all about showing up, locking in, and leveling up.</p>
        
        <p>It's just a small crew here, building the brand one piece at a time. In the coming months, we're working on our TikTok shop and eventually our e-commerce site.</p>
        
        <p>But for now, you've got access to our first free tools — and they're damn useful:</p>
        
        <ul>
          <li><strong>Match Scorekeeper:</strong> Enter the race, enter the names, and keep track as you go. Post it for bragging rights, settle the bet, or just run clean sets that look good.</li>
          <li><strong>Rack Generator</strong> for 8-ball, 9-ball, and 10-ball: quick, visual, and ready to break.</li>
        </ul>
        
        <div style="text-align: center;">
          <a href="${toolsUrl}" class="cta-button">USE THE TOOLS NOW</a>
        </div>
        
        <p>We're building this for players like you. If you find it useful, share it. If you've got feedback — hit us up.</p>
        
        <p>Stay sharp,<br>
        The Deadpunch Team</p>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Deadpunch. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Plain text fallback version of the email
function getWelcomeEmailText(toolsUrl: string): string {
  return `
You're in.

Welcome to Deadpunch — where it's all about showing up, locking in, and leveling up.

It's just a small crew here, building the brand one piece at a time. In the coming months, we're working on our TikTok shop and eventually our e-commerce site.

But for now, you've got access to our first free tools — and they're damn useful:

- Match Scorekeeper: Enter the race, enter the names, and keep track as you go. Post it for bragging rights, settle the bet, or just run clean sets that look good.
- Rack Generator for 8-ball, 9-ball, and 10-ball: quick, visual, and ready to break.

🔥 Use the tools now: ${toolsUrl}

We're building this for players like you. If you find it useful, share it. If you've got feedback — hit us up.

Stay sharp,
The Deadpunch Team
  `;
}

// Request handler for the edge function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get recipient email from request body
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending welcome email to: ${email}`);

    // Configure SMTP client with Apple Mail credentials
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: APPLE_SMTP_HOST,
      port: APPLE_SMTP_PORT,
      username: SENDER_EMAIL,
      password: Deno.env.get("APPLE_SMTP_PASSWORD") || "",
    });

    // Email content configuration
    const logoUrl = "https://yunwcbujnowcifbkfjmr.supabase.co/storage/v1/object/public/assets-deadpunch//IMG_0741.png";
    const toolsUrl = "https://deadpunch.com/training-tools/pool-tools";

    // Send the email
    await client.send({
      from: SENDER_EMAIL,
      to: email,
      subject: "You're In — Welcome to Deadpunch",
      content: getWelcomeEmailText(toolsUrl),
      html: getWelcomeEmailHTML(logoUrl, toolsUrl),
    });

    await client.close();
    console.log(`Welcome email sent successfully to: ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: "Welcome email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error(`Error sending welcome email:`, error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send welcome email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
