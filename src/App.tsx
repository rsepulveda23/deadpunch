
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdmin from "./pages/BlogAdmin";
import Login from "./pages/Login";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Category definitions for routes
const categoryRoutes = [
  // Men category
  { category: "Men", subcategory: "Hats", path: "/men/hats" },
  { category: "Men", subcategory: "Hoodies & Jackets", path: "/men/hoodies-jackets" },
  { category: "Men", subcategory: "T-shirts", path: "/men/t-shirts" },
  { category: "Men", subcategory: "Accessories", path: "/men/accessories" },
  { category: "Men", subcategory: "Stickers", path: "/men/stickers" },
  
  // Women category
  { category: "Women", subcategory: "Hats", path: "/women/hats" },
  { category: "Women", subcategory: "Hoodies & Jackets", path: "/women/hoodies-jackets" },
  { category: "Women", subcategory: "T-shirts", path: "/women/t-shirts" },
  { category: "Women", subcategory: "Accessories", path: "/women/accessories" },
  { category: "Women", subcategory: "Stickers", path: "/women/stickers" },
  
  // New Arrivals category
  { category: "New Arrivals", subcategory: "Hats", path: "/new-arrivals/hats" },
  { category: "New Arrivals", subcategory: "Hoodies & Jackets", path: "/new-arrivals/hoodies-jackets" },
  { category: "New Arrivals", subcategory: "T-shirts", path: "/new-arrivals/t-shirts" },
  { category: "New Arrivals", subcategory: "Accessories", path: "/new-arrivals/accessories" },
  { category: "New Arrivals", subcategory: "Stickers", path: "/new-arrivals/stickers" },
  
  // Training Tools category
  { category: "Training Tools", subcategory: "Journals", path: "/training-tools/journals" },
  { category: "Training Tools", subcategory: "Stickers", path: "/training-tools/stickers" },
  { category: "Training Tools", subcategory: "Accessories", path: "/training-tools/accessories" },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Blog routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog-admin" element={<BlogAdmin />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dynamic category routes */}
          {categoryRoutes.map((route) => (
            <Route 
              key={route.path}
              path={route.path} 
              element={<ComingSoon category={route.category} subcategory={route.subcategory} />} 
            />
          ))}
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
