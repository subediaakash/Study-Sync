import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import PomodoroTimer from "@/components/PomodoroTimer";
import { Message } from "@/components/ChatMessage";
import RoomHeader from "@/components/studyRooms/RoomHeader";
import ChatSection from "@/components/studyRooms/ChatSection";
import ParticipantsList from "@/components/studyRooms/ParticipantsList";
import GoalsSection from "@/components/studyRooms/GoalsSection";
import RoomStatistics from "@/components/studyRooms/RoomStatistics";

import { useAtomValue } from "jotai";
import { authAtom } from "@/auth/atom";

const StudyRoom = () => {
  const user = useAtomValue(authAtom) as { id: string };

  const userId = user.id;

  const { roomId } = useParams();
  const [activeTab, setActiveTab] = useState("chat");
  const [roomInfo] = useState({
    name: "Math Study Room",
    category: "Mathematics",
    focusTime: 50,
    breakTime: 10,
    isOwner: true,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <RoomHeader roomInfo={roomInfo} roomId={roomId || ""} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <div className="md:col-span-2 flex flex-col">
            <Tabs defaultValue="chat" className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger
                  value="chat"
                  className="flex items-center gap-2"
                  onClick={() => setActiveTab("chat")}
                >
                  <MessageSquare size={16} />
                  Chat
                </TabsTrigger>
                <TabsTrigger
                  value="participants"
                  className="flex items-center gap-2"
                  onClick={() => setActiveTab("participants")}
                >
                  <Users size={16} />
                  Participants
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col">
                <ChatSection userId={userId} roomId={roomId} />
              </TabsContent>

              <TabsContent value="participants" className="flex-1">
                <ParticipantsList roomId={roomId} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <PomodoroTimer
              initialFocusTime={roomInfo.focusTime}
              initialBreakTime={roomInfo.breakTime}
            />

            <GoalsSection />

            <RoomStatistics roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
