import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";

interface PomodoroTimerProps {
  initialFocusTime: number;
  initialBreakTime: number;
}

type TimerMode = "focus" | "break";

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  initialFocusTime = 25,
  initialBreakTime = 5,
}) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(initialFocusTime * 60);
  const [totalTime, setTotalTime] = useState(initialFocusTime * 60);
  const [isActive, setIsActive] = useState(false);

  // Reset timer when initial times change
  useEffect(() => {
    if (mode === "focus") {
      setTimeLeft(initialFocusTime * 60);
      setTotalTime(initialFocusTime * 60);
    } else {
      setTimeLeft(initialBreakTime * 60);
      setTotalTime(initialBreakTime * 60);
    }
  }, [initialFocusTime, initialBreakTime, mode]);

  // Timer effect
  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      // When timer finishes, switch modes
      if (mode === "focus") {
        setMode("break");
        setTimeLeft(initialBreakTime * 60);
        setTotalTime(initialBreakTime * 60);
      } else {
        setMode("focus");
        setTimeLeft(initialFocusTime * 60);
        setTotalTime(initialFocusTime * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, initialFocusTime, initialBreakTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === "focus") {
      setTimeLeft(initialFocusTime * 60);
    } else {
      setTimeLeft(initialBreakTime * 60);
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span
            className={`font-medium ${
              mode === "focus" ? "text-study-blue" : "text-gray-500"
            }`}
          >
            Focus Time
          </span>
          <span
            className={`font-medium ${
              mode === "break" ? "text-green-500" : "text-gray-500"
            }`}
          >
            Break Time
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              mode === "focus" ? "bg-study-blue" : "bg-green-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
      </div>

      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0"
          onClick={resetTimer}
        >
          <RefreshCw size={18} />
        </Button>

        <Button
          size="lg"
          className={
            isActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-study-blue hover:bg-study-darkBlue"
          }
          onClick={toggleTimer}
        >
          {isActive ? (
            <>
              <Pause size={16} className="mr-2" /> Pause
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" /> Start
            </>
          )}
        </Button>
      </div>

      <div className="text-center mt-3">
        <span className="text-sm text-gray-500">
          {mode === "focus" ? "Focus" : "Break"} mode: {formatTime(timeLeft)}{" "}
          remaining
        </span>
      </div>
    </div>
  );
};

export default PomodoroTimer;
