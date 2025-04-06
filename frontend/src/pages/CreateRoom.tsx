import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomName: "",
    category: "",
    description: "",
    focusTime: 25,
    breakTime: 5,
    isPrivate: false,
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPrivate: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.roomName.trim()) {
      toast.error("Room name is required");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (formData.isPrivate && !formData.password.trim()) {
      toast.error("Password is required for private rooms");
      return;
    }

    // In a real app, you would send this data to your backend
    console.log("Creating room with data:", formData);

    // Show success message
    toast.success("Room created successfully!");

    // Navigate to the room (in a real app, you would use the ID returned from the server)
    navigate("/room/new");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <Navbar />

      <div className="container  mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-200">
          <h1 className="text-3xl font-semibold mb-8 text-gray-800">
            Create a <span className="text-study-blue">Study Room</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name */}
            <div className="space-y-2">
              <Label htmlFor="roomName" className="text-gray-700">
                Room Name
              </Label>
              <Input
                id="roomName"
                name="roomName"
                placeholder="Enter a name for your study room"
                value={formData.roomName}
                onChange={handleInputChange}
                className="focus:ring-2 focus:ring-study-blue transition"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger
                  id="category"
                  className="focus:ring-2 focus:ring-study-blue transition"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Mathematics",
                    "Computer Science",
                    "Languages",
                    "Technology",
                    "Humanities",
                    "Science",
                    "Business",
                  ].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Description{" "}
                <span className="text-sm text-gray-400">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what you'll be studying..."
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="focus:ring-2 focus:ring-study-blue transition"
              />
            </div>

            {/* Focus / Break Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="focusTime" className="text-gray-700">
                  Focus Time
                </Label>
                <Select
                  value={formData.focusTime.toString()}
                  onValueChange={(value) =>
                    handleSelectChange("focusTime", value)
                  }
                >
                  <SelectTrigger
                    id="focusTime"
                    className="focus:ring-2 focus:ring-study-blue transition"
                  >
                    <SelectValue placeholder="Select focus time" />
                  </SelectTrigger>
                  <SelectContent>
                    {[25, 30, 45, 50, 60].map((time) => (
                      <SelectItem key={time} value={time.toString()}>
                        {time} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breakTime" className="text-gray-700">
                  Break Time
                </Label>
                <Select
                  value={formData.breakTime.toString()}
                  onValueChange={(value) =>
                    handleSelectChange("breakTime", value)
                  }
                >
                  <SelectTrigger
                    id="breakTime"
                    className="focus:ring-2 focus:ring-study-blue transition"
                  >
                    <SelectValue placeholder="Select break time" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15].map((time) => (
                      <SelectItem key={time} value={time.toString()}>
                        {time} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Private Room Switch */}
            <div className="flex items-center justify-between border-t pt-6">
              <div className="space-y-1">
                <Label htmlFor="isPrivate" className="text-gray-700">
                  Private Room
                </Label>
                <p className="text-sm text-gray-500">
                  Require a password to join
                </p>
              </div>
              <Switch
                id="isPrivate"
                checked={formData.isPrivate}
                onCheckedChange={handleSwitchChange}
              />
            </div>

            {/* Password field (conditionally visible) */}
            {formData.isPrivate && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Room Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="focus:ring-2 focus:ring-study-blue transition"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/browse-rooms")}
                className="border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-study-blue hover:bg-study-darkBlue text-white"
              >
                Create Room
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
