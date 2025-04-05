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

  
}
