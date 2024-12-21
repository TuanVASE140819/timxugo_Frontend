"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TreasurePopup from "./TreasurePopup";
import HintPopup from "./HintPopup";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

const treasureIcon = new L.Icon({
  // treasure
  iconUrl: "https://cdn-icons-png.flaticon.com/128/1355/1355982.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const SHRINK_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
const SHRINK_AMOUNT = 50; // Shrink by 50 meters each time
const CENTER: L.LatLngExpression = [10.762622, 106.660172]; // Ho Chi Minh City center

interface Treasure {
  id: string;
  name: string;
  position: L.LatLngExpression;
  radius: number;
}

const initialTreasures: Treasure[] = [
  {
    id: "1",
    name: "Kho báu Bến Thành",
    position: [10.772, 106.698],
    radius: 300,
  },
  {
    id: "2",
    name: "Kho báu Nhà Thờ Đức Bà",
    position: [10.78, 106.699],
    radius: 250,
  },
  {
    id: "3",
    name: "Kho báu Bảo tàng Chứng tích Chiến tranh",
    position: [10.779, 106.692],
    radius: 200,
  },
  {
    id: "4",
    name: "Kho báu Công viên Tao Đàn",
    position: [10.774, 106.692],
    radius: 350,
  },
  {
    id: "5",
    name: "Kho báu Chợ Bình Tây",
    position: [10.751, 106.648],
    radius: 280,
  },
  {
    id: "6",
    name: "Kho báu Bảo tàng Mỹ thuật",
    position: [10.769, 106.702],
    radius: 220,
  },
  {
    id: "7",
    name: "Kho báu Dinh Độc Lập",
    position: [10.777, 106.695],
    radius: 270,
  },
  {
    id: "8",
    name: "Kho báu Công viên Lê Văn Tám",
    position: [10.787, 106.7],
    radius: 320,
  },
  {
    id: "9",
    name: "Kho báu Nhà hát Thành phố",
    position: [10.776, 106.703],
    radius: 230,
  },
  {
    id: "10",
    name: "Kho báu Bưu điện Trung tâm",
    position: [10.779, 106.7],
    radius: 260,
  },
];

function TreasureCircle({
  treasure,
  shrinkAmount,
}: {
  treasure: Treasure;
  shrinkAmount: number;
}) {
  const [radius, setRadius] = useState(treasure.radius);
  const map = useMap();

  useEffect(() => {
    const circle = L.circle(treasure.position, {
      radius: radius,
      color: "var(--primary)",
      fillColor: "var(--primary)",
      fillOpacity: 0.2,
    }).addTo(map);

    return () => {
      map.removeLayer(circle);
    };
  }, [map, treasure.position, radius]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRadius((prevRadius) => Math.max(prevRadius - shrinkAmount, 0));
    }, SHRINK_INTERVAL);

    return () => clearInterval(timer);
  }, [shrinkAmount]);

  return null;
}

export default function Map() {
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(
    null
  );
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SHRINK_INTERVAL / 1000);
  const { toast } = useToast();

  const treasures = useMemo(() => initialTreasures, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          toast({
            title: "Vòng tròn thu hẹp!",
            description: "Các kho báu đã thu hẹp bán kính.",
          });
          return SHRINK_INTERVAL / 1000;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toast]);

  return (
    <div className="flex-1 relative">
      <MapContainer
        center={CENTER}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {treasures.map((treasure) => (
          <React.Fragment key={treasure.id}>
            <Marker
              position={treasure.position}
              icon={treasureIcon}
              eventHandlers={{
                click: () => setSelectedTreasure(treasure),
              }}
            >
              <Popup>
                <strong>{treasure.name}</strong>
                <br />
                Bạn đã tìm thấy kho báu!
              </Popup>
            </Marker>
            <TreasureCircle treasure={treasure} shrinkAmount={SHRINK_AMOUNT} />
          </React.Fragment>
        ))}
      </MapContainer>
      {selectedTreasure && (
        <TreasurePopup
          treasureId={selectedTreasure.id}
          treasureName={selectedTreasure.name}
          radius={selectedTreasure.radius}
          onClose={() => setSelectedTreasure(null)}
        />
      )}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        <Button onClick={() => setShowHint(true)}>Nhận gợi ý</Button>
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white p-2 rounded-md shadow-md md:left-auto md:right-4 md:max-w-xs">
        <p className="text-sm font-medium">
          Thời gian còn lại: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </p>
        {selectedTreasure && (
          <p className="text-sm mt-1">
            Bán kính hiện tại của {selectedTreasure.name}:{" "}
            {selectedTreasure.radius}m
          </p>
        )}
      </div>
      {showHint && <HintPopup onClose={() => setShowHint(false)} />}
    </div>
  );
}
