import { User, Coins, HelpCircle, X } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const content = (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>John Doe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Coins</span>
                <span className="text-sm font-medium">1000/5000</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
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
    </>
  )

  return (
    <>
      <div className="hidden md:block w-64 bg-card p-4 overflow-y-auto border-r">
        {content}
      </div>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] z-[2000]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    </>
  )
}

function TreasureItem({ name, found }: { name: string, found: boolean }) {
  return (
    <li className="flex justify-between items-center p-2 bg-secondary rounded-md">
      <span className="text-secondary-foreground">{name}</span>
      <span className={`text-xs font-medium ${found ? 'text-green-500' : 'text-red-500'}`}>
        {found ? 'Đã tìm thấy' : 'Chưa tìm thấy'}
      </span>
    </li>
  )
}

