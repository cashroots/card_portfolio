import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchIcon, LayoutGridIcon, ListIcon } from "lucide-react";
import { sportOptions, conditionOptions, cardSortOptions } from "@shared/schema";

interface SearchFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  sport: string;
  setSport: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  brand: string;
  setBrand: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export default function SearchFilters({
  search,
  setSearch,
  sport,
  setSport,
  year,
  setYear,
  brand,
  setBrand,
  condition,
  setCondition,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode
}: SearchFiltersProps) {
  const yearOptions = [
    { label: "All Years", value: "all" },
    { label: "2023", value: "2023" },
    { label: "2022", value: "2022" },
    { label: "2021", value: "2021" },
    { label: "2020", value: "2020" },
    { label: "2010-2019", value: "2010-2019" },
    { label: "2000-2009", value: "2000-2009" },
    { label: "Pre-2000", value: "pre-2000" },
  ];
  
  const brandOptions = [
    { label: "All Brands", value: "all" },
    { label: "Topps", value: "Topps" },
    { label: "Panini", value: "Panini" },
    { label: "Upper Deck", value: "Upper Deck" },
    { label: "Bowman", value: "Bowman" },
    { label: "Donruss", value: "Donruss" },
    { label: "Fleer", value: "Fleer" },
  ];
  
  return (
    <Card className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
        <div className="md:w-1/3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="sm:w-1/3">
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger>
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                {sportOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:w-1/3">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:w-1/3">
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                {brandOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-gray-100 text-gray-800" : "text-gray-500 hover:bg-gray-100"}
            >
              <LayoutGridIcon className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-gray-100 text-gray-800" : "text-gray-500 hover:bg-gray-100"}
            >
              <ListIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="text-sm border border-gray-300 rounded min-w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {cardSortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
