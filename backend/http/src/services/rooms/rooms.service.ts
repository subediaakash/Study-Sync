import { PrismaClient, RoomCategory, Prisma } from "@prisma/client";

export class RoomService {
  prisma = new PrismaClient();

  async createRoom(req: any, res: any) {
    const {
      name,
      ownerId,
      category,
      description,
      isPrivate,
      password,
      timerSettings,
    } = req.body;

    try {
      const newTimerSetting = await this.prisma.timerSetting.create({
        data: {
          name: timerSettings?.name || "Default Timer",
          focusTime: timerSettings?.focusTime || 25,
          breakTime: timerSettings?.breakTime || 5,
        },
      });

      const newRoom = await this.prisma.studyRoom.create({
        data: {
          name,
          ownerId,
          category: category as RoomCategory,
          description,
          isPrivate: isPrivate || false,
          password,
          timerSettingId: newTimerSetting.id,
        },
        include: {
          owner: true,
          timerSettings: true,
          participants: true,
        },
      });

      return res.status(201).json(newRoom);
    } catch (error: any) {
      console.error("Error creating room:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }

  async getRooms(req: any, res: any) {
    try {
      const rooms = await this.prisma.studyRoom.findMany({
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

  async getRoomById(req: any, res: any) {
    const { id } = req.params;
    try {
      const room = await this.prisma.studyRoom.findUnique({
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

  async addParticipantToRoom(req: any, res: any) {
    const { participantId } = req.body;
    const { id: roomId } = req.params;
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await this.prisma.studyRoom.findUnique({
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

      const updatedRoom = await this.prisma.studyRoom.update({
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
          owner: true,
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

  async updateRoom(req: any, res: any) {
    const { id } = req.params;
    const { name, category, description, isPrivate, password, timerSettings } =
      req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await this.prisma.studyRoom.findUnique({
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
        await this.prisma.timerSetting.update({
          where: { id: room.timerSettingId },
          data: {
            name: timerSettings.name,
            focusTime: timerSettings.focusTime,
            breakTime: timerSettings.breakTime,
          },
        });
      }

      const updatedRoom = await this.prisma.studyRoom.update({
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
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await this.prisma.studyRoom.findUnique({
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

      await this.prisma.studySession.deleteMany({
        where: { studyRoomId: id },
      });

      await this.prisma.studyRoom.delete({
        where: { id },
      });

      await this.prisma.timerSetting.delete({
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

  async removeParticipantFromRoom(req: any, res: any) {
    const { participantId } = req.body;
    const { id: roomId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await this.prisma.studyRoom.findUnique({
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

      const updatedRoom = await this.prisma.studyRoom.update({
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

  async findRoomsByCategory(
    category: RoomCategory,
    includePrivate: boolean = false
  ): Promise<any[]> {
    const whereClause = {
      category,
      ...(includePrivate ? {} : { isPrivate: false }),
    };

    return this.prisma.studyRoom.findMany({
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
  }

  async findRoomsByName(
    name: string,
    includePrivate: boolean = false
  ): Promise<any[]> {
    const whereClause = {
      name: {
        contains: name,
        mode: Prisma.QueryMode.insensitive, // Case-insensitive search
      },
      ...(includePrivate ? {} : { isPrivate: false }),
    };

    return this.prisma.studyRoom.findMany({
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
  }
}
