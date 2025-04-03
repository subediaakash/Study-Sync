
import React from "react";
import { Clock, Users, Bell, Calendar, MessageSquare, Timer } from "lucide-react";

const features = [
  {
    icon: <Clock className="h-6 w-6 text-theme-blue-medium" />,
    title: "Pomodoro Timer",
    description:
      "Stay focused with customizable Pomodoro timers to maximize your productivity and study efficiently.",
  },
  {
    icon: <Users className="h-6 w-6 text-theme-blue-medium" />,
    title: "Live Study Rooms",
    description:
      "Join virtual rooms with students worldwide, creating a collaborative and motivating study environment.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-theme-blue-medium" />,
    title: "Goal Setting",
    description:
      "Set and track your study goals, monitoring your progress and celebrating achievements.",
  },
  {
    icon: <Bell className="h-6 w-6 text-theme-blue-medium" />,
    title: "Break Reminders",
    description:
      "Get timely notifications for breaks, ensuring you maintain a healthy study-rest balance.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-theme-blue-medium" />,
    title: "Chat Integration",
    description:
      "Communicate with study partners through built-in chat while maintaining focus.",
  },
  {
    icon: <Timer className="h-6 w-6 text-theme-blue-medium" />,
    title: "Productivity Analytics",
    description:
      "Gain insights into your study habits with detailed analytics and progress tracking.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Supercharge Your Study Sessions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines the best productivity techniques with collaborative tools
            to help you achieve more with less effort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-theme-navy">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
