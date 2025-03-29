import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { Mail, Phone } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Function to fetch blog posts from Supabase
const fetchBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
  
  return data;
};

const Blog = () => {
  // Fetch blog posts using React Query
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts
  });

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>
      
      <Navbar />
      
      <section className="pt-32 pb-20 md:py-40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1 mb-4 bg-deadpunch-red/10 border border-deadpunch-red/20 rounded-full backdrop-blur-sm">
              <p className="text-deadpunch-red font-display uppercase tracking-wider text-sm">
                Knowledge & Insights
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 animate-reveal">
              THE DEADPUNCH <span className="text-deadpunch-red">BLOG</span>
            </h1>
            <p className="text-deadpunch-gray-light text-lg">
              Expert strategies, mental game mastery, and insider knowledge to elevate your billiards game
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-64 bg-deadpunch-dark-lighter rounded mb-4"></div>
                <div className="h-4 w-48 bg-deadpunch-dark-lighter rounded"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-deadpunch-red py-10 glass p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
              <p className="text-deadpunch-gray-light">Unable to load blog posts at the moment. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts?.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="glass p-0 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-deadpunch-dark-lighter">
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-deadpunch-dark">
                        <img 
                          src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
                          alt="Deadpunch" 
                          className="h-16 object-contain opacity-30"
                        />
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center text-deadpunch-gray-light text-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          {post.published_at 
                            ? format(parseISO(post.published_at), 'MMM d, yyyy') 
                            : 'Unpublished'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-display font-bold mb-3 group-hover:text-deadpunch-red transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-deadpunch-gray-light text-sm mb-4 flex-1">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                    </p>
                    
                    <div className="flex items-center text-deadpunch-red font-medium text-sm mt-auto">
                      <span>Read more</span>
                      <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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

export default Blog;
