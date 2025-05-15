'use client'

import { useState } from "react"
import SearchBar from "@/components/SearchBar"
import PlatformFilter from "@/components/PlatformFilter"

export default function TrendFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activePlatform, setActivePlatform] = useState<"all" | "youtube" | "reddit" | "twitter">("all")

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handlePlatformChange = (platform: "all" | "youtube" | "reddit" | "twitter") => {
    setActivePlatform(platform)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <SearchBar onSearch={handleSearch} />
      <PlatformFilter 
        activePlatform={activePlatform}
        onChange={handlePlatformChange}
      />
    </div>
  )
} 