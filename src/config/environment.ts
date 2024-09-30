import { Application } from "@/types/application";

interface Environment {
  apiBaseUrl: string;
  useTestData: boolean;
  rpcUrl: string;
  rpcToken: string;
}

const environments: { [key: string]: Environment } = {
  development: {
    apiBaseUrl: "http://localhost:3001/api/v1",
    useTestData: true,
    rpcUrl: "http://localhost:8010/proxy/rpc/v1",
    rpcToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.-Smbgh6Tx3efvys9BHrF57dN8DI4tOe05dL8qC5qPtM",
  },
  staging: {
    apiBaseUrl: "https://allocator-rkh-backend-utcn6.ondigitalocean.app/api/v1",
    useTestData: false,
    rpcUrl: "https://api.node.glif.io/rpc/v1",
    rpcToken: "UXggx8DyJeaIIIe1cJZdnDk4sIiTc0uF3vYJXlRsZEQ=",
  },
  production: {
    apiBaseUrl: "https://allocator-rkh-backend-utcn6.ondigitalocean.app/api/v1",
    useTestData: false,
    rpcUrl: "https://api.node.glif.io/rpc/v1",
    rpcToken: "UXggx8DyJeaIIIe1cJZdnDk4sIiTc0uF3vYJXlRsZEQ=",
  },
};

const currentEnv = process.env.NEXT_PUBLIC_APP_ENV || "development";

export const env: Environment = environments[currentEnv];

// Test data
export const testApplications: Application[] = [
  {
    id: "66f976bde9de8776b74330e0",
    number: 1099,
    name: "Deep Kapur ",
    organization: "Official name pending, currently referred to as Flamenco team, spinning out from Protocol Labs.",
    address: "f2pk34lqjjck5jgsbtd2dnvu5z6pm7tiuujvv6cuy",
    github: "@dkkapur",
    country: "North America",
    region: "North America",
    type: "Manual",
    datacap: "50 ",
    status: {
      phase: "KYC",
      phaseStatus: "IN_PROGRESS"
    },
    phases: {
      application: {
        number: 1099
      },
      submission: {
        githubPrNumber: "123",
        githubPrLink: "https://github.com/dkkapur/test/pull/123",
      }
    },
    githubPrNumber: "123",
    githubPrLink: "https://github.com/dkkapur/test/pull/123",
  },
  {
    id: "77a123bde9de8776b74330e1",
    number: 1100,
    name: "Jane Doe",
    organization: "Tech Innovators Inc.",
    address: "f2pk34lqjjck5jgsbtd2dnvu5z6pm7tiuujvv6cuy",
    github: "@janedoe",
    country: "Europe",
    region: "Europe",
    type: "Manual",
    datacap: "100 ",
    status: {
      phase: "GOVERNANCE_REVIEW",
      phaseStatus: "IN_PROGRESS"
    },
    phases: {
      application: {
        number: 1100
      },
      submission: {
        githubPrNumber: "124",
        githubPrLink: "https://github.com/janedoe/test/pull/124",
      }
    },
    githubPrNumber: "124",
    githubPrLink: "https://github.com/janedoe/test/pull/124",
  },
  {
    id: "88b234cde9de8776b74330e2",
    number: 1101,
    name: "John Smith",
    organization: "Future Tech Solutions",
    address: "f2pk34lqjjck5jgsbtd2dnvu5z6pm7tiuujvv6cuy",
    github: "@johnsmith",
    country: "Asia",
    region: "Asia",
    type: "Manual",
    datacap: "75 ",
    status: {
      phase: "RKH_APPROVAL",
      phaseStatus: "IN_PROGRESS"
    },
    phases: {
      application: {
        number: 1101
      },
      submission: {
        githubPrNumber: "125",
        githubPrLink: "https://github.com/johnsmith/test/pull/125",
      }
    },
    githubPrNumber: "125",
    githubPrLink: "https://github.com/johnsmith/test/pull/125",
  },
  {
    id: "99c345def9de8776b74330e3",
    number: 1102,
    name: "Alice Johnson",
    organization: "NextGen Technologies",
    address: "f2pk34lqjjck5jgsbtd2dnvu5z6pm7tiuujvv6cuy",
    github: "@alicejohnson",
    country: "South America",
    region: "South America",
    type: "Manual",
    datacap: "60 ",
    status: {
      phase: "KYC",
      phaseStatus: "IN_PROGRESS"
    },
    phases: {
      application: {
        number: 1102
      },
      submission: {
        githubPrNumber: "126",
        githubPrLink: "https://github.com/alicejohnson/test/pull/126",
      }
    },
    githubPrNumber: "126",
    githubPrLink: "https://github.com/alicejohnson/test/pull/126",
  },
  // Add more test applications as needed
];