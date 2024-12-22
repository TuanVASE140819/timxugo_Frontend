import Link from "next/link";
import { GemIcon as Treasure, Map, HelpCircle, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center space-x-3">
          <Treasure className="w-8 h-8 text-primary" />
          <span
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-pirata)" }}
          >
            Treasure Hunt
          </span>
        </div>
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-1">
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                asChild
              >
                <Link href="/">Trang chủ</Link>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                asChild
              >
                <Link href="/map" className="flex items-center">
                  <Map className="w-4 h-4 mr-1" />
                  Bản đồ kho báu
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                asChild
              >
                <Link href="/guide" className="flex items-center">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Hướng dẫn
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                asChild
              >
                <Link href="/account" className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Tài khoản
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
