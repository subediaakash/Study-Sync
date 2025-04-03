import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";

const authService = new AuthService();

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    await authService.signup(req, res);
  }

  static async signin(req: Request, res: Response): Promise<void> {
    await authService.signin(req, res);
  }
}
