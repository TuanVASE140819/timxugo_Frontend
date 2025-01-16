"use client";

import { useState, useEffect } from "react";
import { User, GemIcon as Treasure } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

interface XuResponse {
  toaDo: {
    kinhDo: number;
    viDo: number;
  };
  _id: string;
  tenXu: string;
  moTa: string;
  giaTri: number;
  maXu: string;
  banKinh: number;
  thoiGianTao: string;
  isActive: boolean;
  trangThai: string;
  goiY: string[];
}

interface UserInfo {
  name: string;
  rewardPoints: number;
}

interface Wallet {
  totalValue: number;
  foundXu: XuResponse[];
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [treasuresData, setTreasuresData] = useState<Treasure[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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

  const fetchTreasures = () => {
    try {
      const xuWallet = JSON.parse(localStorage.getItem("xuWallet") || "{}");
      const treasures = xuWallet.foundXu || [];

      const transformedData: Treasure[] = treasures.map((xu: XuResponse) => ({
        id: xu._id,
        name: xu.tenXu,
        position: [xu.toaDo.viDo, xu.toaDo.kinhDo],
        found: xu.trangThai !== "chua_tim_thay",
        radius: xu.banKinh,
      }));

      setTreasuresData(transformedData);
    } catch (error) {
      console.error("Error fetching treasures:", error);
    }
  };

  useEffect(() => {
    // Access localStorage only after component mounts
    setUserInfo(JSON.parse(localStorage.getItem("user") || "null"));
    setWallet(JSON.parse(localStorage.getItem("xuWallet") || "null"));
    handleGetLocation();
    fetchTreasures();
  }, []);

  const content = (
    <>
      <Card className="bg-primary/5 border-none">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <span>{userInfo ? userInfo.name : "Chưa đăng nhập"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Điểm thưởng:
                </span>
                <span className="text-lg font-semibold text-primary">
                  {userInfo ? userInfo.rewardPoints : 0}
                </span>
              </div>
              <Progress
                value={((userInfo ? userInfo.rewardPoints : 0) / 5000) * 100}
                className="h-2"
              />
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Xu đã nhận:
                </span>
                <span className="text-lg font-semibold text-primary">
                  {wallet ? wallet.totalValue : 0}
                </span>
              </div>
              <Progress
                value={wallet ? wallet.totalValue : 0}
                max={100}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
        {/* rewardPoints */}
      </Card>
      <div className="mt-6">
        <h3 className="font-bold mb-2 text-lg">
          Danh sách kho báu đã tìm thấy
        </h3>
        <ul className="space-y-2">
          {treasuresData.map((treasure) => (
            <TreasureItem
              key={treasure.id}
              name={treasure.name}
              found={treasure.found}
            />
          ))}
        </ul>
      </div>
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
