"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useState } from "react";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (treasure: { position: [number, number] }) => {
    // Handle navigation to treasure
    console.log("Navigating to treasure:", treasure);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={handleNavigate}
        />
        <Map />
      </div>
      <Footer />
    </div>
  );
}
