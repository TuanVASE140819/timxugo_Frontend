import Link from 'next/link'
import { GemIcon as Treasure, Map, HelpCircle, User, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Treasure className="w-8 h-8" />
          <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-pirata)' }}>Treasure Hunt</span>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li><Button variant="ghost" asChild><Link href="/" className="hover:text-secondary-foreground transition-colors">Trang chủ</Link></Button></li>
            <li><Button variant="ghost" asChild><Link href="/map" className="hover:text-secondary-foreground transition-colors flex items-center"><Map className="w-4 h-4 mr-1" /> Bản đồ kho báu</Link></Button></li>
            <li><Button variant="ghost" asChild><Link href="/guide" className="hover:text-secondary-foreground transition-colors flex items-center"><HelpCircle className="w-4 h-4 mr-1" /> Hướng dẫn</Link></Button></li>
            <li><Button variant="ghost" asChild><Link href="/account" className="hover:text-secondary-foreground transition-colors flex items-center"><User className="w-4 h-4 mr-1" /> Tài khoản</Link></Button></li>
          </ul>
        </nav>
        <Button variant="ghost" className="md:hidden" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>
    </header>
  )
}

