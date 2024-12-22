"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TreasurePopupProps {
  treasureName: string;
  radius: number;
  onClose: () => void;
}

export default function TreasurePopup({
  treasureName,
  radius,
  onClose,
}: TreasurePopupProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thông tin kho báu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Tên kho báu: {treasureName}</p>
          <p>Bán kính: {radius}m</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
