
import React from "react";

const testimonials = [
  {
    content:
      "FocusFlow has completely transformed how I study. The virtual rooms create a sense of community and accountability that keeps me motivated.",
    author: "Sarah Johnson",
    role: "Medical Student",
  },
  {
    content:
      "As a remote worker, it's easy to get distracted. The Pomodoro timer and focus rooms have doubled my productivity in just weeks.",
    author: "Michael Chen",
    role: "Software Developer",
  },
  {
    content:
      "The analytics feature helped me identify my peak focus times. Now I schedule my most important study sessions during those hours.",
    author: "Emma Rodriguez",
    role: "Law Student",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students and professionals who have improved their focus and productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-xl bg-white border border-gray-100 shadow-lg"
            >
              <div className="mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-theme-navy">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
