import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.use(isAuthenticated);

userRouter.get("/created-rooms/:userId", UserController.getRoomCreatedByUser);
userRouter.get(
  "/participating-rooms/:userId",
  UserController.getParticipatingRooms
);
userRouter.delete(
  "/delete-room/:userId",
  UserController.deleteRoomCreatedByUser
);


