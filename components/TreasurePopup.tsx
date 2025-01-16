"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TreasurePopupProps {
  treasureId: string; // This is the required prop
  treasureName: string;
  radius: number;
  hints: Hint[];
  isOpen: boolean;
  onClose: () => void;
}

interface Hint {
  noiDung: string;
  _id: string;
}

export default function TreasurePopup({
  treasureId,
  treasureName,
  radius,
  hints,
  isOpen,
  onClose,
}: TreasurePopupProps) {
  const [selectedHint, setSelectedHint] = useState<Hint | null>(null);
  const [remainingPoints, setRemainingPoints] = useState<number | null>(null);
  const [wasAlreadyViewed, setWasAlreadyViewed] = useState<boolean | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleHintClick = async (hintId: string, hintIndex: number) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user") || "{}")["_id"];
      const response = await fetch(
        `http://localhost:4000/api/xu/${treasureId}/hints?userId=${userId}&hintIndex=${hintIndex}`,
        {
          method: "GET",
        }
      );

      if (response.status === 403) {
        setErrorMessage(
          "Điểm của bạn đã hết. Hãy chờ đến ngày mai hoặc đăng ký thành viên để nhận 5000 điểm thưởng mỗi ngày."
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to use hint");
      }

      const data = await response.json();
      console.log("Hint used successfully:", data);

      setSelectedHint(data.hint);
      setRemainingPoints(data.remainingPoints);
      setWasAlreadyViewed(data.wasAlreadyViewed);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error using hint:", error);
      setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const hintPrices = [100, 200, 500];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] z-[1100] p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Thông tin kho báu
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-lg">
            Tên kho báu: <span className="font-semibold">{treasureName}</span>
          </p>
          <p className="text-lg">
            Bán kính: <span className="font-semibold">{radius}m</span>
          </p>
          <div>
            <h3 className="text-lg font-bold">Gợi ý:</h3>
            <div className="space-y-2">
              {hints && hints.length > 0 ? (
                hints.map((hint, index) => (
                  <Button
                    key={hint._id}
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleHintClick(hint._id, index)}
                  >
                    {index + 1}. {hint.noiDung} - {hintPrices[index]} xu
                  </Button>
                ))
              ) : (
                <p>Không có gợi ý nào.</p>
              )}
            </div>
          </div>
          {selectedHint && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-lg font-bold">Nội dung gợi ý:</h4>
              <p>{selectedHint.noiDung}</p>
              <p>Điểm còn lại: {remainingPoints}</p>
              <p>Đã xem trước: {wasAlreadyViewed ? "Có" : "Không"}</p>
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
