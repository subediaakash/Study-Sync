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

const BasicInfo = () => {
  const handleSave = () => {
    toast.success("Basic information saved successfully", {
      description: "Your room settings have been updated",
    });
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
            defaultValue="We are studying mathematics here"
            className="transition-colors focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-base font-medium">
            Category
          </Label>
          <Select defaultValue="mathematics">
            <SelectTrigger className="w-full transition-colors focus:border-primary">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
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
            className="min-h-[120px] transition-colors focus:border-primary"
            defaultValue="-Finish Derivatives\n-Work on AntiDerivatives"
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
