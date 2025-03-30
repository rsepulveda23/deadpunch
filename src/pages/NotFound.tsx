
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
        
        <Link 
          to="/" 
          className="bg-deadpunch-red hover:bg-white hover:text-deadpunch-red text-white font-semibold py-3 px-8 
          rounded-full transition-all duration-300 border-2 border-transparent hover:border-deadpunch-red
          transform hover:scale-105 shadow-md"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
