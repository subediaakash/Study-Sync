import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";

const TimerSettings = () => {
  const handleSave = () => {
    toast.success("Timer settings saved successfully", {
      description: "Your room timer settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Timer Settings
        </h2>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-2 border-primary/10 hover:border-primary/20 transition-colors">
          <div className="space-y-4">
            <Label htmlFor="focus-time" className="text-base font-medium">
              Focus Time (minutes)
            </Label>
            <Input
              id="focus-time"
              type="number"
              defaultValue="30"
              className="bg-background transition-colors focus:border-primary"
            />
            <p className="text-sm text-muted-foreground">
              Recommended: 25-50 minutes of focused work
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-2 border-primary/10 hover:border-primary/20 transition-colors">
        <div className="space-y-4">
          <Label htmlFor="break-time" className="text-base font-medium">
            Break Time (minutes)
          </Label>
          <Input
            id="break-time"
            type="number"
            defaultValue="5"
            className="bg-background transition-colors focus:border-primary"
          />
          <p className="text-sm text-muted-foreground">
            Recommended: 5-15 minutes to rest
          </p>
        </div>
      </Card>

      <Card className="p-6 border-2 border-primary/10">
        <div className="space-y-4">
          <Label htmlFor="remaining-time" className="text-base font-medium">
            Remaining Time (minutes)
          </Label>
          <Input
            id="remaining-time"
            type="number"
            defaultValue="29"
            readOnly
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-sm text-muted-foreground">
            Current time left in the active session
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TimerSettings;
