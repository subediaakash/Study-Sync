import { RoomCategory, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../lib/db";

export class RoomService {
  async createRoom(req: Request, res: Response) {
    const ownerId = res.locals.user.id;
    if (!ownerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { name, category, description, isPrivate, password, timerSettings } =
      req.body;

    try {
      const newTimerSetting = await prisma.timerSetting.create({
        data: {
          name: timerSettings?.name || "Default Timer",
          focusTime: timerSettings?.focusTime || 25,
          breakTime: timerSettings?.breakTime || 5,
        },
      });
      const newRoom = await prisma.studyRoom.create({
        data: {
          name,
          ownerId,
          category: category as RoomCategory,
          description,
          isPrivate: isPrivate || false,
          password,
          timerSettingId: newTimerSetting.id,
          participants: {
            connect: { id: ownerId },
          },
        },
      });

      const fetchedRoom = await prisma.studyRoom.findUnique({
        where: { id: newRoom.id },
        include: {
          owner: true,
          timerSettings: true,
          participants: true,
        },
      });

      return res.status(201).json(fetchedRoom);
    } catch (error: any) {
      console.error("Error creating room:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }

  async getRooms(req: Request, res: Response) {
    try {
      const rooms = await prisma.studyRoom.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          timerSettings: true,
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return res.status(200).json(rooms);
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRoomById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const room = await prisma.studyRoom.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          timerSettings: true,
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          studySessions: true,
        },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      return res.status(200).json(room);
    } catch (error: any) {
      console.error("Error fetching room:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async addParticipantToRoom(req: Request, res: Response) {
    const { participantId } = req.body;
    const { id: roomId } = req.params;
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await prisma.studyRoom.findUnique({
        where: { id: roomId },
        include: {
          participants: true,
        },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      if (room.ownerId !== user.id) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Only owners can add people in the room",
        });
      }

      const isAlreadyParticipant = room.participants.some(
        (p) => p.id === participantId
      );
      if (isAlreadyParticipant) {
        return res.status(400).json({
          error: "Bad Request",
          message: "User is already a participant in this room",
        });
      }

      const updatedRoom = await prisma.studyRoom.update({
        where: { id: roomId },
        data: {
          participants: {
            connect: { id: participantId },
          },
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          timerSettings: true,
        },
      });

      return res.status(200).json(updatedRoom);
    } catch (error: any) {
      console.error("Error adding participant to room:", error);
      return res.status(500).json({
        error: "Failed to add person to room",
        details: error.message,
      });
    }
  }

  async joinRoom(req: Request, res: Response): Promise<Response> {
    try {
      const { id: roomId } = req.params;
      const user = res.locals.user;

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const room = await prisma.studyRoom.findUnique({
        where: { id: roomId },
        include: { participants: true },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      if (room.isPrivate && room.password !== req.body.password) {
        return res.status(403).json({ error: "Incorrect password" });
      }

      const isAlreadyParticipant = room.participants.some(
        (p) => p.id === user.id
      );
      if (isAlreadyParticipant) {
        return res.status(200).json({ message: "Already a participant" });
      }

      const updatedRoom = await prisma.studyRoom.update({
        where: { id: roomId },
        data: {
          participants: {
            connect: { id: user.id },
          },
        },
        include: {
          participants: true,
          owner: true,
          timerSettings: true,
        },
      });

      return res.status(200).json(updatedRoom);
    } catch (error) {
      console.error("Error joining room:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      return res.status(500).json({
        error: "Failed to join room",
        details: errorMessage,
      });
    }
  }

  async getParticipants(req: any, res: any) {
    const { id: roomId } = req.params;
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await prisma.studyRoom.findUnique({
        where: { id: roomId },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      return res.status(200).json(room.participants);
    } catch (error: any) {
      console.error("Error fetching participants:", error);
      return res.status(500).json({
        error: "Failed to fetch participants",
        details: error.message,
      });
    }
  }

  async updateRoom(req: any, res: any) {
    const { id } = req.params;
    const { name, category, description, isPrivate, password, timerSettings } =
      req.body;
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await prisma.studyRoom.findUnique({
        where: { id },
        include: { timerSettings: true },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      if (room.ownerId !== user.id) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Only owners can update the room",
        });
      }

      if (timerSettings) {
        await prisma.timerSetting.update({
          where: { id: room.timerSettingId },
          data: {
            name: timerSettings.name,
            focusTime: timerSettings.focusTime,
            breakTime: timerSettings.breakTime,
          },
        });
      }

      const updatedRoom = await prisma.studyRoom.update({
        where: { id },
        data: {
          name,
          category: category as RoomCategory,
          description,
          isPrivate,
          password,
        },
        include: {
          owner: true,
          timerSettings: true,
          participants: true,
        },
      });

      return res.status(200).json(updatedRoom);
    } catch (error: any) {
      console.error("Error updating room:", error);
      return res.status(500).json({
        error: "Failed to update room",
        details: error.message,
      });
    }
  }

  async deleteRoom(req: any, res: any) {
    const { id } = req.params;
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await prisma.studyRoom.findUnique({
        where: { id },
        include: { timerSettings: true },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      if (room.ownerId !== user.id) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Only owners can delete the room",
        });
      }

      await prisma.studySession.deleteMany({
        where: { studyRoomId: id },
      });

      await prisma.studyRoom.delete({
        where: { id },
      });

      await prisma.timerSetting.delete({
        where: { id: room.timerSettingId },
      });

      return res.status(200).json({ message: "Room deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting room:", error);
      return res.status(500).json({
        error: "Failed to delete room",
        details: error.message,
      });
    }
  }

  async removeParticipantFromRoom(req: Request, res: Response) {
    const { participantId } = req.body;
    const { id: roomId } = req.params;
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await prisma.studyRoom.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      if (user.id !== room.ownerId && user.id !== participantId) {
        return res.status(403).json({
          error: "Forbidden",
          message:
            "Only room owners or the participant themselves can remove a participant",
        });
      }

      const updatedRoom = await prisma.studyRoom.update({
        where: { id: roomId },
        data: {
          participants: {
            disconnect: { id: participantId },
          },
        },
        include: {
          participants: true,
          owner: true,
          timerSettings: true,
        },
      });

      return res.status(200).json(updatedRoom);
    } catch (error: any) {
      console.error("Error removing participant from room:", error);
      return res.status(500).json({
        error: "Failed to remove participant from room",
        details: error.message,
      });
    }
  }

  // services for different kind of searching

  async findRooms(req: Request, res: Response) {
    const { category, name } = req.query;
    console.log("Request query:", req.query);

    const includePrivate = req.query.includePrivate === "true";
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      let whereClause: any = {};

      if (!includePrivate) {
        whereClause.isPrivate = false;
      }

      if (category && category !== "All") {
        whereClause.category = category as RoomCategory;
      }

      if (name) {
        whereClause.name = {
          contains: typeof name === "string" ? name : String(name),
          mode: Prisma.QueryMode.insensitive,
        };
      }

      console.log("Where clause:", whereClause);

      const roomCount = await prisma.studyRoom.count();
      console.log("Total rooms in database:", roomCount);

      const rooms = await prisma.studyRoom.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          timerSettings: true,
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log("Found rooms:", rooms.length);

      return res.status(200).json(rooms);
    } catch (error: any) {
      console.error("Error finding rooms:", error);
      return res.status(500).json({
        error: "Failed to find rooms",
        details: error.message,
      });
    }
  }

  async getTimerSettings(req: Request, res: Response) {
    const { id: roomId } = req.params;
    const roomTimeSettings = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      select: {
        timerSettings: {
          select: {
            id: true,
            focusTime: true,
            breakTime: true,
            remainingTime: true,
            isPaused: true,
          },
        },
      },
    });

    if (!roomTimeSettings) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.status(200).json(roomTimeSettings.timerSettings);
  }

  async updateTimerSettings(req: Request, res: Response) {
    try {
      const { id: roomId } = req.params;
      const { focusTime, breakTime, remainingTime, isPaused } = req.body;

      const studyRoom = await prisma.studyRoom.findUnique({
        where: { id: roomId },
        select: { timerSettingId: true },
      });

      if (!studyRoom) {
        return res.status(404).json({ error: "Room not found" });
      }

      const updateData: any = {};
      if (focusTime !== undefined) updateData.focusTime = focusTime;
      if (breakTime !== undefined) updateData.breakTime = breakTime;
      if (remainingTime !== undefined) updateData.remainingTime = remainingTime;
      if (isPaused !== undefined) updateData.isPaused = isPaused;

      const updatedTimerSettings = await prisma.timerSetting.update({
        where: { id: studyRoom.timerSettingId },
        data: updateData,
      });

      return res.status(200).json(updatedTimerSettings);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res
          .status(404)
          .json({ error: "Timer settings not found", details: error.message });
      }
      console.error("Error updating timer settings:", error);
      return res.status(500).json({ error: "Failed to update timer settings" });
    }
  }
  async showParticipants(req: Request, res: Response) {
    try {
      const { id: roomId } = req.params;
      const room = await prisma.studyRoom.findUnique({
        where: { id: roomId },
        include: { participants: true },
      });
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      if (room.participants.length === 0) {
        return res.status(404).json({ message: "No participants found" });
      }
      const participants = room.participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
        email: participant.email,
      }));
      return res.status(200).json({ participants });
    } catch (error) {
      console.error("Error fetching participants:", error);
      return res.status(500).json({ error: "Failed to fetch participants" });
    }
  }
}
