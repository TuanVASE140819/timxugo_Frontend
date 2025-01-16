import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import TreasurePopup from "./TreasurePopup";
import HintPopup from "./HintPopup";
import InputPopup from "./InputPopup";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface IconDefaultPrototype extends L.Icon.Default {
  _getIconUrl?: string;
}

delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

const treasureIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.freepik.com/256/15286/15286694.png?semt=ais_hybrid",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const currentPositionIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/929/929426.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const CENTER: L.LatLngExpression = [10.762622, 106.660172];
const SHRINK_INTERVAL = 15 * 60 * 1000;
const SHRINK_AMOUNT = 50;

interface Treasure {
  id: string;
  name: string;
  position: L.LatLngExpression;
  radius: number;
  trangThai: string;
  foundBy?: {
    userId: string;
    foundAt: string;
  };
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
  const [showInputPopup, setShowInputPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SHRINK_INTERVAL / 1000);
  const { toast } = useToast();
  const [currentPosition, setCurrentPosition] =
    useState<L.LatLngExpression | null>(null);

  useEffect(() => {
    const fetchTreasures = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/xu");
        const data: XuResponse[] = await response.json();

        const transformedData: Treasure[] = data.map((xu) => ({
          id: xu._id,
          name: xu.tenXu,
          position: [xu.toaDo.kinhDo, xu.toaDo.viDo], // Corrected order
          radius: 5,
        }));

        setTreasures(transformedData);
      } catch (error) {
        console.error("Error fetching treasures:", error);
      }
    };

    fetchTreasures();
  }, []);

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

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
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
                click: () => {
                  setSelectedTreasure(treasure);
                  setShowPopup(true);
                },
              }}
            />

            <TreasureCircle treasure={treasure} shrinkAmount={SHRINK_AMOUNT} />
          </React.Fragment>
        ))}
        {currentPosition && (
          <Marker position={currentPosition} icon={currentPositionIcon}>
            <Popup>Vị trí hiện tại của bạn</Popup>
          </Marker>
        )}
      </MapContainer>
      {selectedTreasure && (
        <TreasurePopup
          treasureName={selectedTreasure.name}
          radius={selectedTreasure.radius}
          hints={[
            { noiDung: "Gợi ý 1", _id: "0" },
            { noiDung: "Gợi ý 2", _id: "1" },
            { noiDung: "Gợi ý 3", _id: "2" },
          ]}
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
        />
      )}
      {showHint && <HintPopup onClose={() => setShowHint(false)} />}
      {showInputPopup && (
        <InputPopup
          onClose={() => setShowInputPopup(false)}
          onSave={handleSave}
        />
      )}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        <Button onClick={() => setShowHint(true)}>Nhận gợi ý</Button>
        <Button onClick={handleGetLocation}>Lấy vị trí hiện tại</Button>
        <Button onClick={() => setShowInputPopup(true)}>Nhập thông tin</Button>
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
    </div>
  );
}
