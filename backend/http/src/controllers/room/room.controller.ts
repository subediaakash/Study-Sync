import { RoomService } from "../../services/rooms/rooms.service";
import { Request, Response } from "express";

const roomService = new RoomService();

export class RoomController {
  static async createRoom(req: Request, res: Response) {
    await roomService.createRoom(req, res);
  }

  static async getRooms(req: Request, res: Response) {
    await roomService.getRooms(req, res);
  }

  static async getRoomById(req: Request, res: Response) {
    await roomService.getRoomById(req, res);
  }

  static async addParticipantToRoom(req: Request, res: Response) {
    await roomService.addParticipantToRoom(req, res);
  }

  static async updateRoom(req: Request, res: Response) {
    await roomService.updateRoom(req, res);
  }

  static async deleteRoom(req: Request, res: Response) {
    await roomService.deleteRoom(req, res);
  }

  static async removeParticipantFromRoom(req: Request, res: Response) {
    await roomService.removeParticipantFromRoom(req, res);
  }

  static async findRooms(req: Request, res: Response) {
    await roomService.findRooms(req, res);
  }
}
