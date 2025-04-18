import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react"; // Lucide icons

interface ProfileCardProps {
  name: string;
  createdAt: string;
  email: string;
  totalParticipants: number;
  onEditName?: () => void;
  onEditEmail?: () => void;
}

export default function ProfileCard({
  name,
  createdAt,
  email,
  totalParticipants,
  onEditName,
  onEditEmail,
}: ProfileCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-md p-4">
      <CardHeader className="flex flex-col items-center space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{name}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-500 hover:text-black"
            onClick={onEditName}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500">Joined on {createdAt}</p>
      </CardHeader>

      <Separator className="my-4" />

      <CardContent className="space-y-6 text-sm">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">Email:</div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{email}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-500 hover:text-black"
              onClick={onEditEmail}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Total Participants:</span>
          <span className="font-medium text-black">{totalParticipants}</span>
        </div>
      </CardContent>
    </Card>
  );
}
