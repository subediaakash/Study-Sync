import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const server = http.createServer();
server.listen(3080, () => {
  console.log("Server listening on port 3080");
});

const wss = new WebSocketServer({ server });
const connections = new Set<WebSocket>();

const studyRooms = new Map<string, WebSocket[]>();

wss.on("connection", (ws) => {
  let userId = null;
  let roomId = null;

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    switch (data.type) {
      case "join":
        userId = data.userId;
        roomId = data.roomId;

        if (!studyRooms.has(roomId)) {
          studyRooms.set(roomId, []);
        }
        const room = studyRooms.get(roomId);
        if (room) {
          room.push(ws);
        }

        broadcastToRoom(
          roomId,
          {
            type: "user_joined",
            userId: userId,
            timestamp: Date.now(),
          },
          userId
        );

        const roomOfIndividual = studyRooms.get(roomId);
        const roomParticipants = roomOfIndividual
          ? Array.from(roomOfIndividual)
          : [];
        ws.send(
          JSON.stringify({
            type: "room_state",
            participants: roomParticipants,
            timestamp: Date.now(),
          })
        );
        break;
    }
  });
  ws.on("close", () => {
    console.log("Client disconnected");
    connections.delete(ws);
  });
});
