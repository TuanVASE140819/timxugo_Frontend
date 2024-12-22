import { useState, useEffect } from "react";
import { User, HelpCircle, GemIcon as Treasure } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (treasure: Treasure) => void;
}

interface Treasure {
  id: string;
  name: string;
  position: [number, number];
  found: boolean;
  radius: number;
}

const treasures: Treasure[] = [
  {
    id: "1",
    name: "Kho báu 1",
    position: [10.772, 106.698],
    found: true,
    radius: 300,
  },
  {
    id: "2",
    name: "Kho báu 2",
    position: [10.78, 106.699],
    found: false,
    radius: 250,
  },
  {
    id: "3",
    name: "Kho báu 3",
    position: [10.779, 106.692],
    found: false,
    radius: 200,
  },
  // Thêm các kho báu khác
];

export default function Sidebar({ isOpen, onClose, onNavigate }: SidebarProps) {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [showPopup, setShowPopup] = useState(false);
  const [nearestTreasures, setNearestTreasures] = useState<Treasure[]>([]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          console.log("Current position:", [
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const calculateDistance = (
    pos1: [number, number],
    pos2: [number, number]
  ) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((pos2[0] - pos1[0]) * Math.PI) / 180;
    const dLon = ((pos2[1] - pos1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1[0] * Math.PI) / 180) *
        Math.cos((pos2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const findNearestTreasures = () => {
    console.log("Current position in findNearestTreasures:", currentPosition);
    if (!currentPosition) {
      alert("Vui lòng bật vị trí của bạn.");
      return;
    }

    const sortedTreasures = treasures
      .map((treasure) => ({
        ...treasure,
        distance: calculateDistance(currentPosition, treasure.position),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    setNearestTreasures(sortedTreasures);
    setShowPopup(true);
  };

  useEffect(() => {
    console.log("Calling handleGetLocation");
    handleGetLocation();
  }, []);
  const content = (
    <>
      <Card className="bg-primary/5 border-none">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <span>John Doe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Coins</span>
                <Badge variant="secondary">1000/5000</Badge>
              </div>
              <Progress value={20} className="h-2" />
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>3 gợi ý còn lại</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        <h3 className="font-bold mb-2 text-lg">Danh sách kho báu</h3>
        <ul className="space-y-2">
          <TreasureItem name="Kho báu 1" found={true} />
          <TreasureItem name="Kho báu 2" found={false} />
          <TreasureItem name="Kho báu 3" found={false} />
        </ul>
      </div>
      <Button onClick={findNearestTreasures} className="mt-4">
        Kho báu gần nhất
      </Button>
    </>
  );

  return (
    <>
      <div className="hidden md:block w-80 bg-card p-4 overflow-y-auto border-r">
        {content}
      </div>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 z-[2000]">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center space-x-2">
              <Treasure className="w-5 h-5 text-primary" />
              <span>Menu</span>
            </SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-[425px] z-[1100]">
          <DialogHeader>
            <DialogTitle>Kho báu gần bạn nhất</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {nearestTreasures.map((treasure) => (
              <div
                key={treasure.id}
                className="flex justify-between items-center"
              >
                <span>{treasure.name}</span>
                <Button onClick={() => onNavigate(treasure)}>Chỉ đường</Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPopup(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TreasureItem({ name, found }: { name: string; found: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
      <span className="font-medium">{name}</span>
      <Badge variant={found ? "success" : "secondary"} className="rounded-full">
        {found ? "Đã tìm thấy" : "Chưa tìm thấy"}
      </Badge>
    </div>
  );
}
