import RoomSettings from "@/components/editRooms/RoomSettings";
import Navbar from "@/components/Navbar";

const EditRooms = () => {
  return (
    <div className="min-h-screen bg-secondary font-sans antialiased">
      <Navbar />
      <div className="m-10 lg:p-10"></div>
      <RoomSettings />
    </div>
  );
};

export default EditRooms;
