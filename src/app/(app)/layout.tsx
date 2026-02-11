// src/app/(app)/layout.tsx

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen">{children}</main>
    </ProtectedRoute>
  );
}