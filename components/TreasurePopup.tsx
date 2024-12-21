'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GemIcon as Treasure } from 'lucide-react'

interface TreasurePopupProps {
  treasureId: string
  treasureName: string
  radius: number
  onClose: () => void
}

export default function TreasurePopup({ treasureId, treasureName, radius, onClose }: TreasurePopupProps) {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the code to your backend for verification
    if (code === '1234') { // This is a placeholder check
      setMessage('Chúc mừng! Phần thưởng của bạn sẽ được xử lý.')
    } else {
      setMessage('Mã không hợp lệ. Vui lòng thử lại.')
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Treasure className="w-6 h-6 text-primary" />
            <span>{treasureName}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Bán kính hiện tại: {radius}m</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Mã
              </Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Gửi</Button>
          </DialogFooter>
        </form>
        {message && (
          <p className={`mt-4 text-center ${
            message.includes('Chúc mừng') ? 'text-green-500' : 'text-red-500'
          }`}>
            {message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

