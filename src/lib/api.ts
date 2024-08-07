import { ApplicationsResponse } from "@/types/application";

/**
 * API base URL for fetching applications.
 * Set this in your environment variables:
 * - Use "http://localhost:3001/api/v1" for local development
 * - Use "https://filecoin-plus-backend-x5dlwms4sq-ew.a.run.app/api/v1" for production
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

/**
 * Fetches applications based on search criteria and pagination.
 * 
 * @param {string} searchTerm - The search term to filter applications
 * @param {string[]} filters - Array of phase filters to apply
 * @param {number} page - The page number for pagination
 * @param {number} pageLimit - The number of items per page
 * @returns {Promise<ApplicationsResponse>} A promise that resolves to the applications response
 * @throws {Error} If the fetch request fails
 */
export async function fetchApplications(
  searchTerm: string,
  filters: string[],
  page: number,
  pageLimit: number
): Promise<ApplicationsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageLimit.toString(),
  });

  filters.forEach(filter => params.append("phase[]", filter));

  if (searchTerm) {
    params.append("search", searchTerm);
  }

  const url = `${API_BASE_URL}/allocators?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      applications: result.data.allocators.map((allocator: any) => ({
        id: allocator.id,
        number: allocator.number,
        name: allocator.name,
        organization: allocator.organization,
        address: allocator.address,
        github: allocator.github,
        country: allocator.country,
        region: allocator.region,
        type: allocator.type,
        datacap: allocator.datacap,
        createdAt: allocator.createdAt || "2021-09-01T00:00:00.000Z",
        phases: allocator.phases,
        status: {
          phase: allocator.status.phase,
          phaseStatus: allocator.status.phaseStatus,
        },
      })),
      totalCount: result.data.pagination.totalItems,
    };
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    throw new Error("Failed to fetch applications");
  }
}