"use client";

import { Toaster } from "@/components/ui/toaster";

interface ClientWrapperProps {
  children: React.ReactNode;
  pirataFont: string;
}

export function ClientWrapper({ children, pirataFont }: ClientWrapperProps) {
  return (
    <>
      <style jsx>{`
        :root {
          --font-pirata: ${pirataFont};
        }
      `}</style>
      {children}
      <Toaster />
    </>
  );
}
