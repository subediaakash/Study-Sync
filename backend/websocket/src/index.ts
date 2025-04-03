import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const server = http.createServer();
server.listen(3080, () => {
  console.log("Server listening on port 3080");
});

const wss = new WebSocketServer({ server });

const connections: Map<WebSocket, { id: string }> = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    connections.forEach((_, client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.on("close", () => {
    console.log("Client disconnected");
    connections.delete(ws);
  });
});
