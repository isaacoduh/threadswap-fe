import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  );
}