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
        include: {
          participants: true,
          timerSettings: true,
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
          .json({
            message: "You are not authorized to delete this room",
            ownerId: room.ownerId,
            userID: userId,
          });
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
  async removeUserFromRoom(req: Request, res: Response) {
    const userId = res.locals.user.id;
    const roomId = req.params.roomId;
    const participantId = req.body.participantId;
    try {
      const room = await prisma.studyRoom.findUnique({
        where: {
          id: roomId,
        },
        include: {
          participants: true,
        },
      });

      if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
      }
      if (room.ownerId === userId) {
        res.status(403).json({
          message: "You dont have enough permission to remove other users",
        });
        return;
      }
      if (userId === participantId) {
        res.status(403).json({
          message:
            "You cannot remove yourself from the room, you need to delete the room to perform the action",
        });
        return;
      }

      const participant = room.participants.find(
        (participant) => participant.id === participantId
      );

      if (!participant) {
        res.status(404).json({ message: "User not found in this room" });
        return;
      }

      const updatedRoom = await prisma.studyRoom.update({
        where: {
          id: roomId,
        },
        data: {
          participants: {
            disconnect: { id: userId },
          },
        },
      });

      res.status(200).json({
        message: "User removed from room successfully",
        room: updatedRoom,
      });
    } catch (error: any) {
      console.error("Error removing user from room:", error);
      throw new Error("Unable to remove user from room");
    }
  }

  async leaveRoom(req: Request, res: Response) {
    const userId = res.locals.user.id;
    const roomId = req.params.roomId;
    const room = await prisma.studyRoom.findUnique({ where: { id: roomId } });
    //we need to disconnect the user from the room if he wants to leave the room
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    if (room.ownerId === userId) {
      res.status(403).json({
        message: "You cannot leave the room, you are the owner of the room",
      });
      return;
    }
    try {
      const updatedRoom = await prisma.studyRoom.update({
        where: {
          id: roomId,
        },
        data: {
          participants: {
            disconnect: { id: userId },
          },
        },
      });
      res.status(200).json({
        message: "User removed from room successfully",
        room: updatedRoom,
      });
    } catch (error: any) {
      console.error("Error removing user from room:", error);
      throw new Error("Unable to remove user from room");
    }
  }
}
