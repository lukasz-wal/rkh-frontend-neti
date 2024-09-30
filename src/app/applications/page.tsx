"use client";

import React, { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApplications } from "@/lib/api";

import { useAutoRefreshData } from "@/hooks";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

const ITEMS_PER_PAGE = 100;

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const filter = searchParams.get("filter") || "";
  const sort = searchParams.get("sort") || "createdAt:desc";

  const fetchData = useCallback(async () => {
    return await fetchApplications("", [], page, ITEMS_PER_PAGE);
  }, [page, sort, filter]);
  
  const { applications, totalCount, isLoading, error, refetch } =
    useAutoRefreshData(fetchData, 1000); // Refresh every second

  // TODO: This shutters the page when loading
  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(applications);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Applications Dashboard</h1>
      <DashboardTable data={applications} />
    </div>
  );
}

