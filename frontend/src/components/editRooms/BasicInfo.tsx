import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categoryEnumMap = {
  mathematics: "MATHEMATICS",
  computer_science: "COMPUTER_SCIENCE",
  languages: "LANGUAGES",
  technology: "TECHNOLOGY",
  humanities: "HUMANITIES",
  science: "SCIENCE",
  business: "BUSINESS",
};

const BasicInfo = ({ roomData }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(roomData.name);
  const [description, setDescription] = useState(roomData.description || "");
  const [category, setCategory] = useState(roomData.category.toLowerCase());

  const handleSave = async () => {
    try {
      const updatedRoom = {
        name,
        description,
        category: categoryEnumMap[category],
      };

      const response = await axios.put(
        `http://localhost:3000/api/room/${roomData.id}`,
        updatedRoom,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Basic information saved successfully", {
        description: "Your room settings have been updated",
      });
      navigate(`/profile`);
    } catch (error) {
      console.error("Failed to update room", error);
      toast.error("Failed to save changes", {
        description: "Please try again later",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="lg:text-2xl font-semibold text-foreground">
          Basic Information
        </h2>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="room-name" className="text-base font-medium">
            Room Name
          </Label>
          <Input
            id="room-name"
            placeholder="Enter room name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-base font-medium">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full transition-colors focus:border-primary">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="computer_science">Computer Science</SelectItem>
              <SelectItem value="languages">Languages</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="humanities">Humanities</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter room description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] transition-colors focus:border-primary"
          />
          <p className="text-sm text-muted-foreground">
            Describe what this room is about and what participants should expect
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
