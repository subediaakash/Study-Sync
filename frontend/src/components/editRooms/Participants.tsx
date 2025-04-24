import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Participant {
  id: string;
  name: string;
  email: string;
}

const Participants = ({ roomData }) => {
  // Use existing participants if available, otherwise use default
  const initialParticipants =
    Array.isArray(roomData.participants) && roomData.participants.length > 0
      ? roomData.participants
      : [{ id: "1", name: "Aakash Subedi", email: "aakash@gmail.com" }];

  const [participants, setParticipants] =
    useState<Participant[]>(initialParticipants);
  const [email, setEmail] = useState("");

  const handleSave = () => {
    toast.success("Participants list saved successfully", {
      description: "Your room participants have been updated",
    });
  };

  const handleRemove = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
    toast.success("Participant removed successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="lg:text-2xl font-semibold text-foreground">
          Participants
        </h2>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      <div className="space-y-6">
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="participant@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 transition-colors focus:border-primary"
          />
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            Add Participant
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="text-base font-medium text-foreground">
            Current Participants ({participants.length})
          </h3>
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {participant.name ? participant.name[0] : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{participant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {participant.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(participant.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Participants;
