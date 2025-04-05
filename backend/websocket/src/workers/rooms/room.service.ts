import WebSocket from "ws";

export class RoomService {
  private studyRooms: Map<string, Map<string, WebSocket>> = new Map();

  public joinRoom(userId: string, roomId: string, ws: WebSocket): void {
    // ✅ Use correct type
    if (!this.studyRooms.has(roomId)) {
      this.studyRooms.set(roomId, new Map());
    }
    this.studyRooms.get(roomId)?.set(userId, ws);

    this.broadcastToRoom(
      roomId,
      {
        type: "user_joined",
        userId,
        timestamp: Date.now(),
      },
      userId
    );

    const participants = Array.from(this.studyRooms.get(roomId)?.keys() || []);
    ws.send(
      JSON.stringify({
        type: "room_state",
        participants,
        timestamp: Date.now(),
      })
    );
  }

  public leaveRoom(userId: string, roomId: string): void {
    if (this.studyRooms.has(roomId)) {
      this.studyRooms.get(roomId)?.delete(userId);

      if (this.studyRooms.get(roomId)?.size === 0) {
        this.studyRooms.delete(roomId);
      } else {
        this.broadcastToRoom(roomId, {
          type: "user_left",
          userId,
          timestamp: Date.now(),
        });
      }
    }
  }

  public broadcastToRoom(
    roomId: string,
    message: object,
    excludeUserId: string | null = null
  ): void {
    if (this.studyRooms.has(roomId)) {
      this.studyRooms.get(roomId)?.forEach((ws, userId) => {
        if (!excludeUserId || userId !== excludeUserId) {
          ws.send(JSON.stringify(message));
        }
      });
    }
  }
}
