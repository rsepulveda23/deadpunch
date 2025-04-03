
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// Import shared CORS headers
import { corsHeaders } from "../_shared/cors.ts";

// Interface for email data
interface EmailData {
  email: string;
  metadata?: Record<string, any>;
}

// Email sending configuration
const client = new SmtpClient();

// Handler for the edge function
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body to get email data
    const { email, metadata }: EmailData = await req.json();
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    console.log(`[Welcome Email] Sending welcome email to: ${email}`);
    
    // Connect to SMTP server using environment variables
    await client.connectTLS({
      hostname: "smtp.mail.me.com", // Apple SMTP server
      port: 587,
      username: Deno.env.get("APPLE_SMTP_EMAIL"),
      password: Deno.env.get("APPLE_SMTP_PASSWORD"),
    });
    
    // Prepare email content
    const source = metadata?.source || 'website';
    const category = metadata?.category || '';
    const subcategory = metadata?.subcategory || '';
    
    // Customize email based on source/category
    let subject = "Welcome to DEADPUNCH";
    let messageContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
            <h1 style="color: #ff3333;">DEADPUNCH</h1>
          </div>
          <div style="padding: 20px; background-color: #f8f8f8;">
            <h2>Thanks for joining!</h2>
            <p>We're excited to have you on board. You'll be the first to know when we launch our products.</p>
            
            <p>You signed up for updates about: ${category} ${subcategory}</p>
            
            <p>Stay tuned for more information coming soon!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666;">
              <p>© DEADPUNCH. All rights reserved.</p>
              <p>If you didn't sign up for this email, you can safely ignore it.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Send email
    await client.send({
      from: Deno.env.get("APPLE_SMTP_EMAIL") || "noreply@deadpunch.com",
      to: email,
      subject: subject,
      html: messageContent,
    });
    
    // Close connection
    await client.close();
    
    console.log(`[Welcome Email] Successfully sent welcome email to: ${email}`);
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Welcome email sent successfully" }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
    
  } catch (error) {
    // Log and return error response
    console.error('[Welcome Email] Error sending welcome email:', error);
    
    // Try to close the connection if it's open
    try {
      await client.close();
    } catch (e) {
      console.error('[Welcome Email] Error closing SMTP connection:', e);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

// Start serving the function
serve(handler);
