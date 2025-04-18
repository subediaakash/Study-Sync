import { Request, Response } from "express";
import { prisma } from "../../lib/db";

export class UserService {
  async getRoomCreatedByUser(req: Request, res: Response) {
    const userId = req.params.userId;

    try {
      const rooms = await prisma.studyRoom.findMany({
        where: {
          ownerId: userId,
        },
      });
      if (!rooms || rooms.length === 0) {
        res.status(404).json({ message: "No rooms found for this user" });
      }
      res.status(200).json({ rooms });
    } catch (error: any) {
      console.error("Error fetching rooms created by user:", error);
      throw new Error("Unable to fetch rooms created by user");
    }
  }

  async getParticipatingRooms(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
      const rooms = await prisma.studyRoom.findMany({
        where: {
          participants: {
            some: {
              id: userId,
            },
          },
        },
      });
      if (!rooms || rooms.length === 0) {
        res.status(404).json({ message: "No rooms found for this user" });
      }
      res.status(200).json({ rooms });
    } catch (error: any) {
      console.error("Error fetching rooms created by user:", error);
      throw new Error("Unable to fetch rooms created by user");
    }
  }

  async deleteRoomCreatedByUser(req: Request, res: Response) {
    const userId = req.params.userId;
    const roomId = req.body.roomId;
    try {
      const room = await prisma.studyRoom.findUnique({
        where: {
          id: roomId,
        },
      });

      if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
      }
      if (room.ownerId !== userId) {
        res
          .status(403)
          .json({ message: "You are not authorized to delete this room" });
        return;
      }
      const deletedRoom = await prisma.studyRoom.delete({
        where: {
          id: roomId,
        },
      });
      res
        .status(200)
        .json({ message: "Room deleted successfully", room: deletedRoom });
    } catch (error: any) {
      console.error("Error deleting room created by user:", error);
      throw new Error("Unable to delete room created by user");
    }
  }
}
