"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DashboardApplicationsPanel,
  DashboardHeader,
} from "@/components/dashboard";
import Pagination from "@/components/Pagination";
import { fetchApplications } from "@/lib/api";
import Link from "next/link";
import Account from "@/components/Account";
import ScaleLoader from "react-spinners/ScaleLoader";

const PAGE_SIZE = 10;

/**
 * DashboardPage component
 * Renders the main dashboard page with sidebar, header, and applications panel
 */
export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["applications", searchTerm, activeFilters, currentPage],
    queryFn: () =>
      fetchApplications(searchTerm, activeFilters, currentPage, PAGE_SIZE),
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  });

  // const { data, isLoading, error } = useQuery<Application[], Error>(
  //   ["applications", searchTerm, activeFilters],
  //   () => fetchApplications(searchTerm, activeFilters, currentPage, PAGE_SIZE),
  //   refetchInterval: 60000, // Refetch every minute
  //   keepPreviousData: true,
  // );

  const applications = data?.applications || [];
  const totalCount = data?.totalCount || 0;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Applications</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="relative ml-auto flex-1 md:grow-0"></div>
        <Account />
      </header>
      <DashboardHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ScaleLoader />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-500 text-center">
              Error: {error.message}
            </div>
          </div>
        )}
        {!isLoading && !error && (
          <>
            <DashboardApplicationsPanel
              applications={applications}
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
            />
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </>
  );
}
