// src/app/(app)/layout.tsx

import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20">
        <main>{children}</main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}