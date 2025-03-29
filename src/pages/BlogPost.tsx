
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Calendar, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TikTokIcon from '@/components/icons/TikTokIcon';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Function to fetch a specific blog post by slug
const fetchBlogPost = async (slug: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
  
  if (!data) {
    throw new Error('Blog post not found');
  }
  
  return data;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Fetch the blog post using React Query
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => fetchBlogPost(slug || ''),
    enabled: !!slug
  });

  // Handle back navigation
  const handleBack = () => {
    navigate('/blog');
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>
      
      <Navbar />
      
      <section className="pt-32 pb-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="text-deadpunch-gray-light hover:text-white"
              onClick={handleBack}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to all posts
            </Button>
          </div>
          
          {isLoading ? (
            <div className="glass p-8 rounded-xl animate-pulse">
              <div className="h-8 w-3/4 bg-deadpunch-dark-lighter rounded mb-4"></div>
              <div className="h-4 w-1/4 bg-deadpunch-dark-lighter rounded mb-8"></div>
              <div className="h-48 bg-deadpunch-dark-lighter rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-deadpunch-dark-lighter rounded"></div>
                <div className="h-4 bg-deadpunch-dark-lighter rounded"></div>
                <div className="h-4 bg-deadpunch-dark-lighter rounded"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-deadpunch-red py-10 glass p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-2">Post Not Found</h3>
              <p className="text-deadpunch-gray-light mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
              <Button 
                variant="default" 
                className="bg-deadpunch-red hover:bg-deadpunch-red-hover text-white"
                onClick={handleBack}
              >
                View All Posts
              </Button>
            </div>
          ) : post ? (
            <div className="max-w-3xl mx-auto">
              {post.featured_image && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              <div className="glass p-8 md:p-12 rounded-xl">
                <div className="flex items-center text-deadpunch-gray-light text-sm mb-4">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    {post.published_at 
                      ? format(parseISO(post.published_at), 'MMMM d, yyyy') 
                      : 'Unpublished'}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {post.title}
                </h1>
                
                <Separator className="mb-6 bg-deadpunch-dark-lighter" />
                
                <div 
                  className="prose prose-invert prose-red max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-deadpunch-gray-light prose-a:text-deadpunch-red hover:prose-a:text-deadpunch-red-hover prose-li:text-deadpunch-gray-light prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
              
              <div className="mt-8 text-center">
                <Link to="/blog">
                  <Button variant="ghost" className="text-deadpunch-gray-light hover:text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to all posts
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      
      {/* Footer from Index page */}
      <footer className="py-6 border-t border-deadpunch-dark-lighter">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
              alt="Deadpunch" 
              className="h-8 object-contain mr-4" 
            />
            
            {/* Social Media Links moved next to logo */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <a 
                  href="https://www.tiktok.com/@deadpunch.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-deadpunch-gray-light hover:text-deadpunch-red transition-colors duration-300"
                  aria-label="TikTok"
                >
                  <TikTokIcon size={64} />
                  <span className="ml-2 text-sm font-medium">Follow Us</span>
                </a>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-80 p-0 bg-deadpunch-dark-lighter border-deadpunch-gray-dark rounded-lg overflow-hidden" 
                sideOffset={12}
              >
                <div className="flex flex-col">
                  <div className="relative w-full aspect-[1/1] overflow-hidden">
                    {/* Replace the image with the Deadpunch logo */}
                    <img 
                      src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
                      alt="Deadpunch TikTok" 
                      className="w-full h-full object-contain bg-deadpunch-dark p-6"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <TikTokIcon size={32} />
                      <span className="text-white text-sm font-medium ml-2">@deadpunch.com</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-medium mb-1">DEADPUNCH on TikTok</h4>
                    <p className="text-deadpunch-gray-light text-sm mb-3">
                      Check out our latest videos and updates on TikTok
                    </p>
                    <Button 
                      variant="default" 
                      className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover"
                      onClick={() => window.open('https://www.tiktok.com/@deadpunch.com', '_blank')}
                    >
                      Visit our TikTok
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          {/* Contact info in the middle */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0 text-deadpunch-gray-light">
            <a href="mailto:contact@deadpunch.com" className="flex items-center hover:text-deadpunch-red transition-colors duration-300">
              <Mail size={16} className="mr-2" />
              <span className="text-sm">contact@deadpunch.com</span>
            </a>
            <a href="tel:+14134759156" className="flex items-center hover:text-deadpunch-red transition-colors duration-300">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">413-475-9156</span>
            </a>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="text-deadpunch-gray-light text-sm">
              &copy; {new Date().getFullYear()} Deadpunch™. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default BlogPost;
