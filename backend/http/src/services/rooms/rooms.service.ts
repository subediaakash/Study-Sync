import { PrismaClient } from "@prisma/client";

export class RoomService {
  prisma = new PrismaClient();
  async createRoom(req: any, res: any) {
    const { name, ownerId } = req.body;
    try {
      const newRoom = await this.prisma.studyRoom.create({
        data: {
          name,
          ownerId,
        },
      });
      return res.status(201).json(newRoom);
    } catch (error: any) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRooms(req: any, res: any) {
    try {
      const rooms = await this.prisma.studyRoom.findMany();
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
        where: { id: id },
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

  async addPeopleInRoom(req: any, res: any) {
    const personId = req.body.personId;
    const roomId = req.params.id;
    const user = req.locals.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const userId = user.id;
      // to check weather the person who is trying to add is the owner of the room or not
      const room = await this.prisma.studyRoom.findUnique({
        where: { id: roomId },
      });
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      if (room.ownerId !== userId) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Only owners can add people in the good",
        });
      }

      const updatedRoom = await this.prisma.studyRoom.update({
        where: { id: roomId },
        data: {
          participants: {
            connect: { id: personId },
          },
        },
      });
      return res.status(200).json(updatedRoom);
    } catch (error: any) {
      return res.status(500).json({
        error: "Failed to add person to room",
        details: error.message,
      });
    }
  }
}
