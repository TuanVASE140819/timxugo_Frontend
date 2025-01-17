"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!name || !email || !password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://timxugo-backend-2.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "user", // Thêm trường role
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Đăng ký thành công",
          description: "Vui lòng đăng nhập để tiếp tục",
        });
        window.location.href = "/login";
      } else {
        const data = await response.json();
        toast({
          title: "Lỗi đăng ký",
          description: data.message || "Có lỗi xảy ra",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối đến server",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Đăng ký</CardTitle>
        <CardDescription>
          Tạo tài khoản mới để tham gia trò chơi
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Họ tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">Đăng ký</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/login")}
          >
            Đăng nhập
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
