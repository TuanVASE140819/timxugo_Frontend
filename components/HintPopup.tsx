"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface HintPopupProps {
  onClose: () => void;
}

export default function HintPopup({ onClose }: HintPopupProps) {
  const [hintUsed, setHintUsed] = useState(false);

  const useHint = () => {
    // Here you would typically send a request to your backend to use a hint
    setHintUsed(true);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] z-[1100]">
        {" "}
        {/* Thêm z-index */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            <span>Gợi ý kho báu</span>
          </DialogTitle>
        </DialogHeader>
        {!hintUsed ? (
          <>
            <p className="text-center py-4">
              Bạn có muốn sử dụng một gợi ý không?
            </p>
            <DialogFooter>
              <Button onClick={useHint} className="w-full">
                Sử dụng gợi ý
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <p className="text-center py-4">
              Kho báu gần bạn nhất cách khoảng 500 mét.
            </p>
            <DialogFooter>
              <Button onClick={onClose} className="w-full">
                Đóng
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
