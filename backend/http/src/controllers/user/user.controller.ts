import { Request, Response } from "express";
import { UserService } from "../../services/user/user.service";

const userService = new UserService();

export class UserController {
  static async getRoomCreatedByUser(req: Request, res: Response) {
    await userService.getRoomCreatedByUser(req, res);
  }

  static async getParticipatingRooms(req: Request, res: Response) {
    await userService.getParticipatingRooms(req, res);
  }

  static async deleteRoomCreatedByUser(req: Request, res: Response) {
    await userService.deleteRoomCreatedByUser(req, res);
  }
  static async leaveRoom(req: Request, res: Response) {
    await userService.leaveRoom(req, res);
  }
  static async removeParticipantFromRoom(req: Request, res: Response) {
    await userService.removeUserFromRoom(req, res);
  }
}
