"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  coins: number;
  hintsRemaining: number;
}

interface UserContextProps {
  userInfo: UserInfo;
  fetchUserInfo: () => void;
  saveUserInfo: (user: UserInfo, token: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: "",
    name: "",
    email: "",
    role: "",
    coins: 0,
    hintsRemaining: 0,
  });

  const fetchUserInfo = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        console.log("User ID not found in localStorage");
        return;
      }

      console.log(`Fetching user info for ID: ${user.id}`);
      const response = await fetch(
        `https://timxugo-backend-2.vercel.app/api/users/${user.id}`
      );
      const data = await response.json();
      console.log("User info:", data);

      setUserInfo({
        id: data.id,
        name: data.name || "Unknown User",
        email: data.email,
        role: data.role,
        coins: data.coins || 0,
        hintsRemaining: data.hintsRemaining || 0,
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const saveUserInfo = (user: UserInfo, token: string) => {
    document.cookie = `token=${token}; path=/`;
    localStorage.setItem("user", JSON.stringify(user));
    setUserInfo(user);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, fetchUserInfo, saveUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
