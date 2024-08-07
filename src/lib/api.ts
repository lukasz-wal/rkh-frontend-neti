import { ApplicationPhase, ApplicationsResponse } from "@/types/application";

// "http://localhost:3001/api/v1";
// "https://filecoin-plus-backend-x5dlwms4sq-ew.a.run.app/api/v1";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchApplications(
  searchTerm: string,
  filters: string[],
  page: number,
  pageLimit: number
): Promise<ApplicationsResponse> {
  let url = `${API_BASE_URL}/allocators?page=${page}&limit=${pageLimit}`;
  for (const filter of filters) {
    url += `&phase[]=${filter}`;
  }
  if (searchTerm) {
    url += `&search=${searchTerm}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  // map the response to the ApplicationsResponse type from json
  const result = await response.json();
  console.log(result);

  console.log(result.data.allocators);
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
      createdAt: "2021-09-01T00:00:00.000Z",

      phases: allocator.phases,
      status: {
        phase: allocator.status.phase,
        phaseStatus: allocator.status.phaseStatus,
      },
    })),
    totalCount: result.data.pagination.totalItems,
  };
}

export async function startApplicationPhase(
  id: string,
  phase: ApplicationPhase
) {
  const response = await fetch(
    `${API_BASE_URL}/allocators/${id}/phases/${phase}/start`,
    {
      method: "POST",
    }
  );

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to start application phase");
  }
}

export async function completeApplicationPhase(
  id: string,
  phase: ApplicationPhase
) {
  const response = await fetch(
    `${API_BASE_URL}/allocators/${id}/phases/${phase}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        result: "approved",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to complete application phase");
  }
}

export async function submitKYC(id: string) {
  await fetch(`http://localhost:8080/${id}/kyc`);
}

export async function startKYC(id: string) {
  const response = await fetch(`${API_BASE_URL}/allocators/${id}/kyc`, {
    method: "POST",
  });

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to start KYC");
  }
}

export async function approveKYC(id: string) {
  const response = await fetch(`${API_BASE_URL}/allocators/${id}/kyc/approve`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to approve KYC");
  }
}

export async function rejectKYC(id: string) {
  const response = await fetch(`${API_BASE_URL}/allocators/${id}/kyc/reject`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to reject KYC");
  }
}

export async function submitGovernanceReview(id: string, status: string) {
  const response = await fetch(
    `${API_BASE_URL}/allocators/actions/setGovernanceReviewStatus`,
    {
      method: "POST",
      body: JSON.stringify({
        id,
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to submit governance review");
  }
}
