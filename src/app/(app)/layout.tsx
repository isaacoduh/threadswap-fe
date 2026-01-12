// src/app/(app)/layout.tsx

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-20">
      <Header variant="search" />
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
