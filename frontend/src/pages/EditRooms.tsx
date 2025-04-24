import RoomSettings from "@/components/editRooms/RoomSettings";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

const EditRooms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomData = location.state?.roomData;
  console.log("Room data:", roomData);
  if (!roomData) {
    navigate("/");
  }
  return (
    <div className="min-h-screen bg-secondary font-sans antialiased">
      <Navbar />
      <div className="m-10 lg:p-10"></div>
      <RoomSettings roomData={roomData} />
    </div>
  );
};

export default EditRooms;
