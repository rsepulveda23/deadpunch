
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Category definitions for routes
const categoryRoutes = [
  { category: "Men", subcategory: "Hats", path: "/men/hats" },
  { category: "Men", subcategory: "Hoodies & Jackets", path: "/men/hoodies-jackets" },
  { category: "Men", subcategory: "T-shirts", path: "/men/t-shirts" },
  { category: "Men", subcategory: "Accessories", path: "/men/accessories" },
  
  { category: "Women", subcategory: "Hats", path: "/women/hats" },
  { category: "Women", subcategory: "Hoodies & Jackets", path: "/women/hoodies-jackets" },
  { category: "Women", subcategory: "T-shirts", path: "/women/t-shirts" },
  { category: "Women", subcategory: "Accessories", path: "/women/accessories" },
  
  { category: "New Arrivals", subcategory: "Hats", path: "/new-arrivals/hats" },
  { category: "New Arrivals", subcategory: "Hoodies & Jackets", path: "/new-arrivals/hoodies-jackets" },
  { category: "New Arrivals", subcategory: "T-shirts", path: "/new-arrivals/t-shirts" },
  { category: "New Arrivals", subcategory: "Accessories", path: "/new-arrivals/accessories" },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
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
