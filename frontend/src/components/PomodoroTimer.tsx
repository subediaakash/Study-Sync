import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSettings {
  id: string;
  focusTime: number;
  breakTime: number;
  remainingTime: number; // in minutes (from backend)
  isPaused: boolean;
}

interface PomodoroTimerProps {
  roomId: string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ roomId }) => {
  const [timeSettings, setTimeSettings] = useState<TimeSettings | null>(null);
  const [localTimeLeft, setLocalTimeLeft] = useState<number>(0); // in seconds
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastServerSync, setLastServerSync] = useState<number>(Date.now());
  const [isLocalUpdate, setIsLocalUpdate] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const tickCountRef = useRef<number>(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef<boolean>(true);

  const logTimerState = (action: string, state: { [key: string]: unknown }) => {
    console.log(`Timer [${action}]:`, {
      ...state,
      intervalActive: !!intervalRef.current,
    });
  };

  const fetchTimeSettings = async () => {
    try {
      // Skip polling if local update is in progress
      if (isLocalUpdate) return;

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

      // Only apply server time during initial load or when timer is paused
      const serverTimeLeft = parsedSettings.remainingTime * 60; // convert to seconds
      const currentMode = serverTimeLeft <= 0 ? "break" : "focus";

      setTimeSettings(parsedSettings);

      // Only update local time from server on initial load or when paused
      // This prevents overriding the local countdown
      if (initialLoadRef.current || parsedSettings.isPaused) {
        setLocalTimeLeft(serverTimeLeft);
        setMode(currentMode);
        initialLoadRef.current = false;
      }

      setIsLoading(false);
      setLastServerSync(Date.now());

      // Update running state based on server pause state
      // But don't update the timer's current time when running
      setIsRunning(!parsedSettings.isPaused);

      logTimerState("fetch-complete", {
        isPaused: parsedSettings.isPaused,
        remainingTime: serverTimeLeft,
        isLocalUpdate,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const updateTimeSettings = async (data: Partial<TimeSettings>) => {
    try {
      setIsLocalUpdate(true);

      const dataToSend = { ...data };
      if (dataToSend.remainingTime !== undefined) {
        dataToSend.remainingTime = Math.ceil(dataToSend.remainingTime / 60); // send as minutes
      }

      await fetch(`http://localhost:3000/api/room/update-time/${roomId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      setLastServerSync(Date.now());

      setTimeout(() => {
        setIsLocalUpdate(false);
      }, 1000);
    } catch (err) {
      console.error("Update error:", err);
      setIsLocalUpdate(false);
    }
  };

  const handleTimerTick = () => {
    if (!timeSettings) return;

    const now = Date.now();
    const elapsed = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;

    setLocalTimeLeft((prev) => {
      const adjustedElapsed = Math.max(0.5, Math.min(2, elapsed));
      const newTime = Math.max(0, prev - adjustedElapsed);

      if (newTime <= 0) {
        const nextMode = mode === "focus" ? "break" : "focus";
        const nextDuration =
          (nextMode === "focus"
            ? timeSettings.focusTime
            : timeSettings.breakTime) * 60;

        setMode(nextMode);

        updateTimeSettings({
          remainingTime: nextDuration,
          isPaused: false,
        });

        logTimerState("mode-switch", {
          prevMode: mode,
          newMode: nextMode,
          newTime: nextDuration,
        });

        return nextDuration;
      }

      tickCountRef.current += 1;
      if (tickCountRef.current >= 4) {
        updateTimeSettings({
          remainingTime: newTime,
          isPaused: false,
        });
        tickCountRef.current = 0;
      }

      return newTime;
    });
  };

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    lastTickRef.current = Date.now();
    tickCountRef.current = 0;

    intervalRef.current = setInterval(handleTimerTick, 1000);
    setIsRunning(true);

    logTimerState("timer-started", { mode });
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);

    logTimerState("timer-stopped", { localTimeLeft });
  };

  const togglePause = () => {
    if (!timeSettings) return;

    const newPauseState = !timeSettings.isPaused;

    setTimeSettings((prev) =>
      prev ? { ...prev, isPaused: newPauseState } : null
    );

    updateTimeSettings({
      remainingTime: localTimeLeft,
      isPaused: newPauseState,
    });

    if (newPauseState) {
      stopTimer();
    } else {
      startTimer();
    }

    logTimerState("toggle-pause", { newPauseState });
  };

  const resetTimer = () => {
    if (!timeSettings) return;

    const newTime = timeSettings.focusTime * 60;

    stopTimer();
    setLocalTimeLeft(newTime);
    setMode("focus");

    setTimeSettings((prev) => (prev ? { ...prev, isPaused: true } : null));

    updateTimeSettings({
      remainingTime: newTime,
      isPaused: true,
    });

    logTimerState("reset", { newTime });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    fetchTimeSettings();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(() => {
      fetchTimeSettings();
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeSettings && !timeSettings.isPaused) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!timeSettings) return;

    if (timeSettings.isPaused !== !isRunning) {
      setIsRunning(!timeSettings.isPaused);
    }
  }, [timeSettings?.isPaused]);

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
