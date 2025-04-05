import { RoomService } from "../../services/rooms/rooms.service";
import { Request, Response } from "express";

const roomService = new RoomService();

export class RoomController {
  static async createRoom(req: Request, res: Response) {
    await roomService.createRoom(req, res);
  }

  static async getRooms(req: Request, res: Response) {
    const roomService = new RoomService();
    await roomService.getRooms(req, res);
  }

  static async getRoomById(req: Request, res: Response) {
    const roomService = new RoomService();
    await roomService.getRoomById(req, res);
  }
}
