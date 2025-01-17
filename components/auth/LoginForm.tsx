import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/components/UserContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchUserInfo } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://timxugo-backend.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Lưu token vào cookie
        document.cookie = `token=${data.token}; path=/`;

        // Lưu thông tin user vào localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            rewardPoints: data.user.rewardPoints,
            createdAt: data.user.createdAt,
          })
        );

        // Lưu thông tin xuWallet vào localStorage
        localStorage.setItem("xuWallet", JSON.stringify(data.xuWallet));

        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
        });

        // Fetch user info after successful login
        console.log("Calling fetchUserInfo after login");
        fetchUserInfo();

        window.location.href = "/";
      } else {
        toast({
          title: "Lỗi đăng nhập",
          description: data.message || "Email hoặc mật khẩu không đúng",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối đến server",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>Đăng nhập để bắt đầu cuộc phiêu lưu</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/register")}
          >
            Đăng ký
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
