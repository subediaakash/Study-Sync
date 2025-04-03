
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-theme-blue-dark mr-2" />
          <span className="text-xl font-bold bg-gradient-to-r from-theme-blue-dark to-theme-blue-medium bg-clip-text text-transparent">
            Study Sync
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium text-gray-700 hover:text-theme-blue-medium transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-theme-blue-medium transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-theme-blue-medium transition-colors">
            Pricing
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden md:flex border-theme-blue-medium text-theme-blue-medium hover:bg-theme-blue-medium hover:text-white">
            Login
          </Button>
          <Button className="bg-theme-blue-medium hover:bg-theme-blue-dark text-white">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
