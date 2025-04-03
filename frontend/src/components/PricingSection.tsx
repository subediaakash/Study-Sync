
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const pricingPlans = [
  {
    title: "Free",
    price: "$0",
    description: "Perfect for occasional studying",
    features: [
      "Join public study rooms",
      "Basic Pomodoro timer",
      "Chat with study partners",
      "Limited analytics",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    title: "Pro",
    price: "$9.99",
    period: "/month",
    description: "For dedicated students",
    features: [
      "Create private study rooms",
      "Advanced timer customization",
      "Goal tracking & reminders",
      "Full productivity analytics",
      "Custom focus music",
      "Priority support",
    ],
    buttonText: "Start Free Trial",
    popular: true,
  },
  {
    title: "Team",
    price: "$29.99",
    period: "/month",
    description: "For study groups & classes",
    features: [
      "Everything in Pro",
      "Up to 20 simultaneous users",
      "Group analytics & reports",
      "Custom branding",
      "Admin controls",
      "API access",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your study needs, with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden border ${
                plan.popular
                  ? "border-theme-blue-medium shadow-xl scale-105"
                  : "border-gray-100 shadow-md"
              } bg-white transition-all hover:shadow-xl relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 text-xs font-semibold text-center py-1 bg-theme-blue-medium text-white">
                  MOST POPULAR
                </div>
              )}
              
              <div className={`p-6 ${plan.popular ? "pt-8" : "pt-6"}`}>
                <h3 className="text-xl font-bold text-theme-navy mb-2">{plan.title}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-theme-navy">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-theme-blue-medium flex-shrink-0 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-theme-blue-medium hover:bg-theme-blue-dark text-white"
                      : "bg-white text-theme-blue-medium border border-theme-blue-medium hover:bg-theme-blue-medium hover:text-white"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
