import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InputPopupProps {
  onClose: () => void;
  onSave: (tenXu: string, maXu: string) => Promise<string>; // Thay đổi kiểu trả về thành Promise<string>
}

export default function InputPopup({ onClose, onSave }: InputPopupProps) {
  const [tenXu, setTenXu] = useState("");
  const [maXu, setMaXu] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const resultMessage = await onSave(tenXu, maXu);
    setMessage(resultMessage);
    if (resultMessage.includes("Chúc mừng")) {
      setTimeout(() => {
        onClose();
      }, 3000); // Đóng popup sau 3 giây
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogOverlay className="z-[1100]" />
      <DialogContent className="sm:max-w-[425px] z-[1100] p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Nhập thông tin kho báu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tên kho báu"
            value={tenXu}
            onChange={(e) => setTenXu(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Mã kho báu"
            value={maXu}
            onChange={(e) => setMaXu(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {message && <p className="text-red-500">{message}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Lưu</Button>
          <div className="mb-2" />
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
