import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GemIcon as Treasure, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = document.cookie.includes("token=");
    setIsLoggedIn(token);
  }, []);

  const handleLogout = () => {
    // Remove token from cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    // Remove user info from localStorage
    localStorage.removeItem("user");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <header className="bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center space-x-3">
          <Treasure className="w-8 h-8 text-primary" />
          <span
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-pirata)" }}
          >
            Đi Tìm Lỳ Xỳ May Mắn
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
            {!isLoggedIn ? (
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  asChild
                >
                  <Link href="/login" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Đăng nhập</span>
                  </Link>
                </Button>
              </li>
            ) : (
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Đăng xuất</span>
                </Button>
              </li>
            )}
          </ul>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open menu</span>
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
