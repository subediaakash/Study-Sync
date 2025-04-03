
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create or Join a Room",
    description:
      "Start your own study room or join one of the many active rooms based on your subject or interest.",
  },
  {
    number: "02",
    title: "Set Your Focus Time",
    description:
      "Configure your Pomodoro timer with your preferred focus and break intervals to match your study style.",
  },
  {
    number: "03",
    title: "Study Together",
    description:
      "Focus alongside other students, seeing their progress and staying motivated through shared accountability.",
  },
  {
    number: "04",
    title: "Track Your Progress",
    description:
      "Review your study sessions with detailed analytics to improve your habits and reach your goals faster.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How FocusFlow Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple process to boost your productivity and connect with like-minded students.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-blue-100 -translate-x-1/2"></div>
          
          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8`}>
                  <div className="lg:w-1/2 text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-theme-blue-medium text-white text-xl font-bold mb-4 relative z-10">
                      {step.number.split('')[1]}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-theme-navy">{step.title}</h3>
                    <p className="text-gray-600 max-w-lg mx-auto lg:mx-0">{step.description}</p>
                  </div>
                  
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-blue-100 to-white shadow-lg flex items-center justify-center">
                      <div className="text-6xl font-bold text-theme-blue-light opacity-50">
                        {step.number}
                      </div>
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 mt-6">
                    <ArrowDown className="text-blue-200 h-8 w-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button className="bg-theme-blue-medium hover:bg-theme-blue-dark text-white px-8 py-6 text-lg">
            Get Started for Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
