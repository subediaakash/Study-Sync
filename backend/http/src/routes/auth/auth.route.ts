import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";

export const authRouter = Router();

authRouter.post("/signup", AuthController.signup);
authRouter.post("/signin", AuthController.signin);
authRouter.get("/profile", AuthController.getUser);
authRouter.post("/logout", AuthController.logout);
