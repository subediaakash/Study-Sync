import { Router } from "express";
import { RoomController } from "../../controllers/room/room.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

export const roomRouter = Router();

roomRouter.use(isAuthenticated);

roomRouter.get("/find", RoomController.findRooms);
roomRouter.post("/join/:id", RoomController.joinRoom);

roomRouter.post("/", RoomController.createRoom);
roomRouter.get("/", RoomController.getRooms);
roomRouter.get("/:id", RoomController.getRoomById);
roomRouter.put("/:id", RoomController.updateRoom);
roomRouter.delete("/:id", RoomController.deleteRoom);

// Participant management

roomRouter.post("/:id/participants", RoomController.addParticipantToRoom);
roomRouter.delete(
  "/:id/participants",
  RoomController.removeParticipantFromRoom
);
