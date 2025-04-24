import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Privacy = ({ roomData }) => {
  const [isPrivate, setIsPrivate] = useState(roomData.isPrivate);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    toast.success("Privacy settings saved successfully", {
      description: "Your room privacy settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Privacy Settings
        </h2>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
      <div className="space-y-8">
        <div className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent/50 transition-colors">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">Private Room</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, only users with the password can join this room
            </p>
          </div>
          <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
        </div>
        {isPrivate && (
          <div className="space-y-3 p-4 rounded-lg bg-card">
            <Label htmlFor="password" className="text-base font-medium">
              Room Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter room password"
                defaultValue={roomData.password}
                className="pr-10 transition-colors focus:border-primary"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose a strong password that you can share with invited
              participants
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Privacy;
