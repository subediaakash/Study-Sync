import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAtomValue } from "jotai";
import { authAtom } from "@/auth/atom";

interface Participant {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface TimerSettings {
  id: string;
  name: string;
  focusTime: number;
  remainingTime: number;
  breakTime: number;
  createdAt: string;
  isPaused: boolean;
}

export interface Room {
  id: string;
  name: string;
  category: string;
  description: string;
  ownerId: string;
  timerSettingId: string;
  isPrivate: boolean;
  password: string | null;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
  timerSettings: TimerSettings;
}

interface RoomsResponse {
  rooms: Room[];
}

export const useCreatedRooms = (userId: string) => {
  return useQuery({
    queryKey: ["created-rooms", userId],
    queryFn: async () => {
      const { data } = await axios.get<RoomsResponse>(
        `http://localhost:3000/api/user/created-rooms/${userId}`,
        {
          withCredentials: true,
        }
      );
      return data.rooms;
    },
    enabled: !!userId,
  });
};
