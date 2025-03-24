
import { toast } from '@/hooks/use-toast';

// Define the message type to match OpenAI's API
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// System message that provides context about DEADPUNCH
const systemMessage: Message = {
  role: 'system',
  content: `You are the DEADPUNCH AI assistant. DEADPUNCH is an upcoming revolutionary sports platform.

Key information:
- DEADPUNCH is "The Future of Sports"
- DEADPUNCH is launching soon
- Users can sign up for early access and notifications
- Your tone should be confident, helpful, and slightly bold
- If users want to be notified about the launch, encourage them to share their email
- Do not make up specific features unless explicitly mentioned
- Keep responses concise and engaging
- If someone asks a question you don't know the answer to, admit that and offer to take their contact information to have someone follow up

Your main goals are to:
1. Answer questions about DEADPUNCH
2. Collect emails for the notification list
3. Build excitement about the upcoming launch`
};

// Function to generate a response from the OpenAI API
export const generateChatResponse = async (messages: Message[]): Promise<string> => {
  // If OpenAI integration is not fully set up yet, return a fallback response
  const isMockMode = true; // Set to false when you have a real OpenAI key

  if (isMockMode) {
    console.log('Using mock OpenAI response...');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Basic response logic based on user's last message
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastMessage.includes('launch') || lastMessage.includes('when')) {
      return "DEADPUNCH is launching soon! We don't have an exact date yet, but you can sign up to be notified as soon as we go live. Would you like to leave your email to get early access?";
    }
    
    if (lastMessage.includes('what is') || lastMessage.includes('about')) {
      return "DEADPUNCH is set to revolutionize the sports industry. We're combining cutting-edge technology with sports in ways that haven't been done before. Stay tuned for the game-changing experience we're building!";
    }
    
    if (lastMessage.includes('email') || lastMessage.includes('notify') || lastMessage.includes('sign up')) {
      return "I'd be happy to add you to our notification list! Just share your email address and you'll be among the first to know when DEADPUNCH launches.";
    }
    
    if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      return "Hey there! I'm excited to tell you about DEADPUNCH. We're getting ready to change the game in sports. What would you like to know about us?";
    }
    
    return "Thanks for your interest in DEADPUNCH! We're working on something big in the sports world. Is there anything specific you'd like to know, or would you like to be notified when we launch?";
  }

  try {
    // Prepare the messages for the API, including the system message
    const apiMessages = [systemMessage, ...messages];
    
    // Replace with your actual API call when you have a key
    const response = await fetch('YOUR_EDGE_FUNCTION_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    toast({
      title: 'Error',
      description: 'Failed to get a response from the AI assistant.',
      variant: 'destructive',
    });
    return "I'm having trouble connecting right now. Please try again later or reach out to us directly.";
  }
};
