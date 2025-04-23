import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function EditRoomPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const roomData = location.state?.roomData;

  useEffect(() => {
    console.log("Received room data in EditRoomPage:", roomData);
    if (!roomData && roomId) {
      console.log(
        "Room data not passed via state, consider fetching by ID if needed."
      );
    }
  }, [location.state, roomId, roomData]);

  if (!roomData && !roomId) {
    return <p>No room information provided.</p>;
  }

  return (
    <div>
      <h1>
        {roomData
          ? `Edit Room: ${roomData.name}`
          : `Editing Room ID: ${roomId}`}
      </h1>
      {roomData && <pre>{JSON.stringify(roomData, null, 2)}</pre>}
    </div>
  );
}
