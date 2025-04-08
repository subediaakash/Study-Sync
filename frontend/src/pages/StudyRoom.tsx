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

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    content:
      "Welcome to the study room! Let's focus and be productive together.",
    sender: {
      name: "Sarah",
      initials: "SJ",
      avatar: "",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isCurrentUser: false,
  },
  {
    id: "2",
    content: "I'm working on calculus problems. Anyone else studying math?",
    sender: {
      name: "Michael",
      initials: "MP",
      avatar: "",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isCurrentUser: false,
  },
  {
    id: "3",
    content: "I'm here to study math too! Currently going through derivatives.",
    sender: {
      name: "You",
      initials: "YO",
      avatar: "",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isCurrentUser: true,
  },
  {
    id: "4",
    content:
      "Perfect! I could use some help with integrals later if you have time.",
    sender: {
      name: "Michael",
      initials: "MP",
      avatar: "",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    isCurrentUser: false,
  },
];

const MOCK_PARTICIPANTS = [
  {
    id: "1",
    name: "Sarah Johnson",
    initials: "SJ",
    status: "studying" as const,
  },
  {
    id: "2",
    name: "Michael Park",
    initials: "MP",
    status: "studying" as const,
  },
  {
    id: "3",
    name: "You",
    initials: "YO",
    status: "studying" as const,
    isCurrentUser: true,
  },
  { id: "4", name: "Alex Doe", initials: "AD", status: "break" as const },
  { id: "5", name: "Jamie Smith", initials: "JS", status: "studying" as const },
];

const StudyRoom = () => {
  const { roomId } = useParams();
  const [activeTab, setActiveTab] = useState("chat");
  const [roomInfo] = useState({
    name: "Math Study Room",
    category: "Mathematics",
    focusTime: 50,
    breakTime: 10,
    isOwner: true, // For demo purposes - would be determined by auth
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
                  Participants ({MOCK_PARTICIPANTS.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col">
                <ChatSection initialMessages={MOCK_MESSAGES} />
              </TabsContent>

              <TabsContent value="participants" className="flex-1">
                <ParticipantsList participants={MOCK_PARTICIPANTS} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <PomodoroTimer
              initialFocusTime={roomInfo.focusTime}
              initialBreakTime={roomInfo.breakTime}
            />

            <GoalsSection />

            <RoomStatistics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
