'use client'

import { useState } from "react";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <Header
        variant="search"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <div className="p-4">
        {/* Your home feed content */}
        <h2 className="text-lg font-semibold">Welcome to ThreadSwap</h2>
      </div>
    </>
  );
}
