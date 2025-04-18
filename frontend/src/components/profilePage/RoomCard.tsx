import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RoomCard() {
  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">Math Study Room</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Mathematics
          </CardDescription>
        </div>
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-none"
        >
          Owner
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Participants:</span>
          <span className="font-medium text-black">5</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Last active:</span>
          <span className="font-medium text-black">2024-04-03</span>
        </div>
        <div className="flex gap-2 pt-4">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            Enter Room
          </Button>
          <Button variant="outline" className="flex-1">
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
