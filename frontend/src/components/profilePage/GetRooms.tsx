import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, Lock, Globe, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Room {
  id: string;
  name: string;
  category: string;
  description: string;
  isPrivate: boolean;
  password: string | null;
  createdAt: string;
}

interface CreatedRoomsProps {
  rooms: Room[];
  onEditRoom?: (roomId: string) => void;
}

export default function CreatedRooms({ rooms, onEditRoom }: CreatedRoomsProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md p-6 bg-white rounded-lg">
      <CardHeader className="pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Study Rooms</h2>
        <p className="text-sm text-gray-500">
          {rooms.length} room{rooms.length !== 1 ? "s" : ""} created
        </p>
      </CardHeader>

      <Separator className="my-4 bg-gray-200" />

      <CardContent className="space-y-6">
        {rooms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              You haven't created any rooms yet
            </p>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link to="/create-room">Create Your First Room</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {room.name}
                      </h3>
                      {room.isPrivate ? (
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          <Lock className="h-3 w-3" />
                          <span>Private</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" />
                          <span>Public</span>
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant="secondary" className="capitalize">
                        {room.category.toLowerCase()}
                      </Badge>

                      {room.isPrivate && room.password && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          <Key className="h-3 w-3" />
                          <span>Password: {room.password}</span>
                        </div>
                      )}

                      <span className="text-gray-400 text-sm">
                        Created {new Date(room.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 hover:text-black"
                      onClick={() => onEditRoom?.(room.id)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Link to={`/rooms/${room.id}`}>Join Room</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {rooms.length > 0 && (
        <div className="mt-6 text-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/create-room">Create New Room</Link>
          </Button>
        </div>
      )}
    </Card>
  );
}
