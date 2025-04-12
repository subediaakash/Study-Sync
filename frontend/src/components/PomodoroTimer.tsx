import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSettings {
  id: string;
  focusTime: number;
  breakTime: number;
  remainingTime: number;
  isPaused: boolean;
}

interface PomodoroTimerProps {
  roomId: string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ roomId }) => {
  const [timeSettings, setTimeSettings] = useState<TimeSettings | null>(null);
  const [localTimeLeft, setLocalTimeLeft] = useState<number>(0);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdatedRef = useRef<number>(Date.now());

  const fetchTimeSettings = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/room/${roomId}/time`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      const settings = data.timerSettings || data;

      const parsedSettings: TimeSettings = {
        ...settings,
        isPaused: settings.isPaused !== undefined ? settings.isPaused : true,
      };

      setTimeSettings(parsedSettings);
      setLocalTimeLeft(parsedSettings.remainingTime * 60);
      setMode(parsedSettings.remainingTime <= 0 ? "break" : "focus");
      lastUpdatedRef.current = Date.now();
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const updateTimeSettings = async (data: Partial<TimeSettings>) => {
    try {
      const dataToSend = { ...data };
      if (dataToSend.remainingTime !== undefined) {
        dataToSend.remainingTime = Math.ceil(dataToSend.remainingTime / 60);
      }

      await fetch(`http://localhost:3000/api/room/update-time/${roomId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!timeSettings || timeSettings.isPaused) return;

      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdatedRef.current) / 1000);
      const newTimeLeft = Math.max(0, localTimeLeft - elapsed);

      if (newTimeLeft <= 0) {
        const nextMode = mode === "focus" ? "break" : "focus";
        const nextDuration =
          (nextMode === "focus"
            ? timeSettings.focusTime
            : timeSettings.breakTime) * 60;

        setMode(nextMode);
        setLocalTimeLeft(nextDuration);
        lastUpdatedRef.current = now;

        updateTimeSettings({
          remainingTime: nextDuration,
          isPaused: false,
        });
      } else {
        setLocalTimeLeft(newTimeLeft);
      }

      lastUpdatedRef.current = now;
    }, 1000);
  };

  const togglePause = () => {
    if (!timeSettings) return;

    const newPauseState = !timeSettings.isPaused;

    updateTimeSettings({
      remainingTime: localTimeLeft,
      isPaused: newPauseState,
    });

    setTimeSettings({ ...timeSettings, isPaused: newPauseState });
    lastUpdatedRef.current = Date.now();

    if (!newPauseState) startTimer();
  };

  const resetTimer = () => {
    if (!timeSettings) return;

    const newTime = timeSettings.focusTime * 60;
    updateTimeSettings({
      remainingTime: newTime,
      isPaused: true,
    });

    setLocalTimeLeft(newTime);
    setMode("focus");
    setTimeSettings({ ...timeSettings, isPaused: true });
    lastUpdatedRef.current = Date.now();

    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    fetchTimeSettings();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!timeSettings || timeSettings.isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);

    let tickCount = 0;

    intervalRef.current = setInterval(() => {
      setLocalTimeLeft((prev) => {
        if (prev <= 0) {
          // Switch modes
          const nextMode = mode === "focus" ? "break" : "focus";
          const nextDuration =
            (nextMode === "focus"
              ? timeSettings.focusTime
              : timeSettings.breakTime) * 60;

          setMode(nextMode);
          setLocalTimeLeft(nextDuration);
          lastUpdatedRef.current = Date.now();

          // Update server immediately on mode switch
          updateTimeSettings({
            remainingTime: nextDuration,
            isPaused: false,
          });

          return nextDuration;
        }

        const newTime = prev - 1;
        tickCount++;

        if (tickCount >= 4) {
          updateTimeSettings({
            remainingTime: newTime, // Will be converted to minutes in updateTimeSettings
            isPaused: false,
          });
          tickCount = 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeSettings?.isPaused, mode]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-12 w-full mb-4" />
        <div className="flex justify-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    );
  }

  if (isError || !timeSettings) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-red-500">Failed to load timer</p>
      </div>
    );
  }

  const currentDuration =
    mode === "focus"
      ? timeSettings.focusTime * 60
      : timeSettings.breakTime * 60;
  const progress = ((currentDuration - localTimeLeft) / currentDuration) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span
            className={`font-medium ${
              mode === "focus" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Focus: {timeSettings.focusTime}m
          </span>
          <span
            className={`font-medium ${
              mode === "break" ? "text-green-600" : "text-gray-500"
            }`}
          >
            Break: {timeSettings.breakTime}m
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              mode === "focus" ? "bg-blue-600" : "bg-green-600"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="text-4xl font-bold">{formatTime(localTimeLeft)}</div>
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
            timeSettings.isPaused
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }
          onClick={togglePause}
        >
          {timeSettings.isPaused ? (
            <>
              <Play size={16} className="mr-2" /> Resume
            </>
          ) : (
            <>
              <Pause size={16} className="mr-2" /> Pause
            </>
          )}
        </Button>
      </div>

      <div className="text-center mt-3">
        <span className="text-sm text-gray-500">
          {mode === "focus" ? "Focus" : "Break"} mode •{" "}
          {timeSettings.isPaused ? "Paused" : "Running"}
        </span>
      </div>
    </div>
  );
};

export default PomodoroTimer;
