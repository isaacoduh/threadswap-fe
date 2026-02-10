'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/features/home/components/HeroBanner";

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <Header
        variant="search"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <div className="p-6">
        {/* Hero */}
        <HeroBanner />
      </div>
    </>
  );
}
