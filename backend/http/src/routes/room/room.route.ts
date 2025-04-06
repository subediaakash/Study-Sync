import { Router } from "express";
import { RoomController } from "../../controllers/room/room.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

export const roomRouter = Router();

roomRouter.use(isAuthenticated);
roomRouter.post("/", RoomController.createRoom);
roomRouter.get("/", RoomController.getRooms);
roomRouter.get("/:id", RoomController.getRoomById);
roomRouter.post("/add/:id", RoomController.addPeopleInRoom);
