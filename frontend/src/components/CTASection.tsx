
import React from "react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-theme-blue-dark to-theme-blue-medium text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="max-w-2xl mb-8 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Study Habits?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of students around the world who are achieving their goals with Study Sync.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-white text-theme-blue-dark hover:bg-blue-50 hover:text-theme-blue-dark/90 px-8 py-6 text-lg">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
