import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Room {
  id: string;
  name: string;
  category: string;
  description: string;
  ownerId: string;
  isPrivate: boolean;
  password: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useParticipatingRooms = (userId: string) => {
  return useQuery<Room[]>({
    queryKey: ["participatingRooms", userId],
    queryFn: async () => {
      const { data } = await axios.get(
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
