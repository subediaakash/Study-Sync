import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfileCardProps {
  name: string;
  createdAt: string;
  email: string;
  totalParticipants: number;
}

export default function ProfileCard({
  name,
  createdAt,
  email,
  totalParticipants,
}: ProfileCardProps) {
  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <Badge
          variant="outline"
          className="mt-2 text-sm bg-blue-100 text-blue-800 border-none"
        >
          Account Created
        </Badge>
        <p className="text-sm text-gray-500 mt-1">{createdAt}</p>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-4 mt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Email:</span>
          <span className="font-medium text-black text-right">{email}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Total Participants:</span>
          <span className="font-medium text-black">{totalParticipants}</span>
        </div>
      </CardContent>
    </Card>
  );
}
