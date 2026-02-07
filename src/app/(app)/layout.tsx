// src/app/(app)/layout.tsx

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/bottom-nav";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20">
        <Header variant="search" />
        <main>{children}</main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
