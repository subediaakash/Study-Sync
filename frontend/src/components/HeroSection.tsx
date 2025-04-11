import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-16 bg-hero-pattern">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-theme-blue-medium border border-blue-100">
              <span className="text-xs font-medium">
                Study together, succeed together
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Focus Better with
              <span className="bg-gradient-to-r from-theme-blue-dark to-theme-blue-medium text-transparent bg-clip-text">
                {" "}
                Virtual{" "}
              </span>
              Study Rooms
            </h1>

            <p className="text-xl text-gray-600 max-w-xl">
              Join live study rooms with Pomodoro timers and collaborate with
              students and remote workers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                className="bg-theme-blue-medium hover:bg-theme-blue-dark text-white px-8 py-6 text-lg"
                onClick={() => navigate("/create-rooms")}
              >
                Start Studying Now
              </Button>
              <Button
                onClick={() => navigate("/browse-rooms")}
                variant="outline"
                className="border-theme-blue-medium text-theme-blue-medium hover:bg-theme-blue-medium hover:text-white px-8 py-6 text-lg"
              >
                Explore Rooms
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white bg-blue-${
                      300 + i * 100
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-theme-navy">1000+</span>{" "}
                students currently studying
              </p>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="glass-card p-6 rounded-xl shadow-xl animate-float">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-theme-navy">
                      Math Study Room
                    </h3>
                    <p className="text-sm text-gray-500">with 7 students</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 border-white bg-blue-${
                          300 + i * 100
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-theme-blue-medium h-2.5 rounded-full w-3/4"></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-medium text-gray-500">
                      Focus Time
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      37:45 / 50:00
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                  <Button
                    size="sm"
                    className="bg-theme-blue-medium hover:bg-theme-blue-dark"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Join Room
                  </Button>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 glass-card p-4 shadow-lg rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">234 Rooms Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
