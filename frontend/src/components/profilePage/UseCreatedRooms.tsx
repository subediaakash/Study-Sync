import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAtomValue } from "jotai";
import { authAtom } from "@/auth/atom";

interface Room {
  id: string;
  name: string;
  category: string;
  description: string;
  isPrivate: boolean;
  password: string | null;
  createdAt: string;
}

export const useCreatedRooms = (userId: string) => {
  return useQuery({
    queryKey: ["created-rooms", userId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/user/created-rooms/${userId}`,
        {
          withCredentials: true,
        }
      );
      return data.rooms as Room[];
    },
    enabled: !!userId,
  });
};
