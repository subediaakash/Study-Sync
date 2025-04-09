import * as http from "http";
import express from "express";
import WebSocket, { WebSocketServer as WSS } from "ws";
import { RoomService } from "./workers/rooms/room.service";

class WebSocketServer {
  private server: http.Server;
  private wss: WSS;
  private roomService: RoomService;

  constructor() {
    const app = express();
    this.server = http.createServer(app);
    this.wss = new WSS({ server: this.server });
    this.roomService = new RoomService();

    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.wss.on("connection", (ws: WebSocket) => {
      let userId: string | null = null;
      let roomId: string | null = null;

      ws.on("message", (message: string) => {
        try {
          const data = JSON.parse(message);
          switch (data.type) {
            case "join":
              userId = data.userId;
              roomId = data.roomId;
              if (!userId || !roomId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "User ID and room ID are required",
                  })
                );
              }
              this.roomService.joinRoom(userId, roomId, ws);
              break;

            case "pomodoro_update":
              if (roomId) {
                this.roomService.broadcastToRoom(roomId, {
                  type: "pomodoro_update",
                  timerState: data.timerState,
                  timestamp: Date.now(),
                });
              }
              break;

            case "task_update":
              if (roomId) {
                this.roomService.broadcastToRoom(roomId, {
                  type: "task_update",
                  userId,
                  tasks: data.tasks,
                  timestamp: Date.now(),
                });
              }
              break;

            case "chat":
              if (roomId) {
                this.roomService.broadcastToRoom(roomId, {
                  type: "chat",
                  userId,
                  message: data.message,
                  timestamp: Date.now(),
                });
              }
              break;
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });

      ws.on("close", () => {
        if (roomId && userId) {
          this.roomService.leaveRoom(userId, roomId);
        }
      });
    });
  }

  public start(port: number): void {
    this.server.listen(port, () => {
      console.log(`WebSocket server running on port ${port}`);
    });
  }
}

// Start server
const webSocketServer = new WebSocketServer();
webSocketServer.start(8080);
