import Link from "next/link";
import { Search, ListFilter, File, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

const OPTIONS: Option[] = [
  { label: "SUBMISSION", value: "SUBMISSION" },
  { label: "KYC", value: "KYC" },
  { label: "GOVERNANCE_REVIEW", value: "GOVERNANCE_REVIEW" },
  { label: "RKH_APPROVAL", value: "RKH_APPROVAL" },
];

interface DashboardHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
}

export function DashboardHeader({
  searchTerm,
  setSearchTerm,
  activeFilters,
  setActiveFilters,
}: DashboardHeaderProps) {
  const filters = ["Active", "Draft", "Archived"];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="px-10">
          <MultipleSelector
            defaultOptions={OPTIONS}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                All phases selected
              </p>
            }
            onChange={(selectedOptions) => {
              setActiveFilters(selectedOptions.map((option) => option.value));
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filter
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem>SUBMISSION</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>KYC</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              GOVERNANCE_REVIEW
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>RKH_APPROVAL</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            <Link
              href="https://airtable.com/app64ajISFdqLB7XK/pagJzPpLypcEH5Cd3/form"
              target="_blank"
            >
              Add
            </Link>
          </span>
        </Button>
      </div>
    </header>
  );
}
