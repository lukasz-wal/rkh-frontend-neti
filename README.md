# Filecoin Plus - Backend

[![License: MIT][license-badge]][license]

[license]: LICENSE.md
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

![banner](./img/banner.png)

> 🚧 **Warning:** This project is currently WIP, the information provided may be outdated.

This repository contains the source code for the backend service responsible for managing the Filecoin Plus program.

## Project Overview
The `filecoin-plus-backend` service manages the entire lifecycle of applications within the Filecoin Plus program. It is designed as an event-driven system to automate and streamline the process from initial application submission to final approval. The system starts with a GitHub pull request (PR), which triggers the subsequent automated workflows, aligning with the requirement that all application-related activities are managed via GitHub.

The backend service is responsible for the following key functionalities:
- **Application Submission**: Accepting applications from users and submitting them to the Filecoin-Allocator registry repository.
- **KYC Process**: Managing the KYC process for applicants.
- **Governance Review**: Facilitating the governance review process for applications.
- **Root Key Holder Approval**: Managing the on-chain approval process for root key holders.

## System Architecture
- Node JS
- Typescript
- MongoDB for storing application data
- RabbitMQ for message queuing
- Express API
- Worker services

```mermaid
stateDiagram-v2
    [*] --> Submission
    Submission --> KYC_Not_Started: ApplicationSubmitted
    KYC_Not_Started --> KYC_In_Progress: KYCStarted
    KYC_In_Progress --> KYC_Completed: KYCApproved
    KYC_In_Progress --> KYC_Failed: KYCRejected
    KYC_Completed --> Governance_Review_In_Progress: GovernanceReviewStarted
    Governance_Review_In_Progress --> Governance_Review_Completed: GovernanceReviewApproved
    Governance_Review_In_Progress --> Governance_Review_Failed: GovernanceReviewRejected
    Governance_Review_Completed --> RKH_Approval_In_Progress: RKHApprovalStarted
    RKH_Approval_In_Progress --> RKH_Approval_Completed: RKHApprovalsUpdated[approvals >= threshold]
    RKH_Approval_In_Progress --> RKH_Approval_Failed: RKHApprovalsUpdated[approvals < threshold]
    RKH_Approval_Completed --> [*]
    KYC_Failed --> [*]
    Governance_Review_Failed --> [*]
    RKH_Approval_Failed --> [*]
    Submission --> Submission_Failed: Error during submission
    Submission_Failed --> [*]
```

### Application Submission
- Applications are submitted via a Form connected to an Airtable
- For GDP compliance, the application data is split into two different views, a public and private view.
- The public data is fetched by the Filecoin Plus backend and stored in a MongoDB database. The data is fetched using the [airtable](https://www.npmjs.com/package/airtable) NPM package.
- Afterwards the backend will create a PR application to the Filecoin-Allocator registry repository. containing the formatted json file with the public data.

![Application Phase](img/phases/application-phase.png)

### KYC Process
- After the application is accepted the applican will be provided a link to the Toggle platform to complete KYC.
- The KYC process is done through the Toggle platform. The Toggle platform will provide a KYC status to the Filecoin Plus backend.

![KYC Phase](img/phases/kyc-phase.png)

### Governance Review
- After the KYC is accept

![Governance Review Phase](img/phases/governance-review-phase.png)


### Root Key Holder Approval

The Filecoin Plus Backend is designed to streamline the process of data storage and retrieval transactions on the Filecoin network, enhancing the efficiency and scalability of storage deals. The main flows of the system include client authentication, data storage request processing, and interaction with the Filecoin blockchain to finalize deals.

## Architecture and Tech Stack

## Getting Started

This section provides instructions on how to setup the project locally and using Docker.
Before starting, you can clone the repository by running the following command:

```bash
git clone https://github.com/threesigmaxyz/filecoin-plus-backend.git
```

### Docker Setup

#### Prerequisites

Before running the Docker setup, you need to have the following tools installed:

- Docker (`docker`)
- Docker Compose (`docker compose`)

#### Configuration

The Docker setup can be configured by setting the following environment variables:

| Environment Variable     | Description                                                              | Example Values                   |
| ------------------------ | ------------------------------------------------------------------------ | -------------------------------- |
| `API_PORT`               | Port number for the API service                                          | `3001`                           |
| `MONGODB_URI`            | URI for connecting to MongoDB                                            | `mongodb://localhost:27017/`     |
| `RABBITMQ_URL`           | URL for connecting to RabbitMQ                                           | `localhost:5672`                 |
| `RABBITMQ_USERNAME`      | Username for RabbitMQ authentication                                     | `admin`                          |
| `RABBITMQ_PASSWORD`      | Password for RabbitMQ authentication                                     | `admin`                          |
| `RABBITMQ_EXCHANGE_NAME` | Name of the RabbitMQ exchange                                            | `filecoin-plus`                  |
| `RABBITMQ_EXCHANGE_TYPE` | Type of the RabbitMQ exchange                                            | `topic`                          |
| `RABBITMQ_QUEUE_NAME`    | Name of the RabbitMQ queue                                               | `allocator`                      |
| `GITHUB_AUTH_TOKEN`      | A PAT required to serve as authentication for read and write permissions | `github_pat_*******************` |
| `AIRTABLE_API_KEY`       | API key for accessing the Airtable API                                   | `pat*******************`         |
| `AIRTABLE_BASE_ID`       | ID of the Airtable base                                                  | `app*******************`         |
| `AIRTABLE_TABLE_NAME`    | Name of the Airtable table                                               | `tbl*******************`         |

#### Running

You can run the Docker containers by running the following command:

```bash
docker compose up -d
```

This will start the backend service, database and message broker.
By default, the backend service will be available at `http://localhost:3001`.

After you are done, you can stop the containers by running:

```bash
docker compose down
```

# About Us

[Three Sigma](https://threesigma.xyz/) is a venture builder firm focused on blockchain engineering, research, and investment. Our mission is to advance the adoption of blockchain technology and contribute towards the healthy development of the Web3 space. If you are interested in joining our team, please contact us
[here](mailto:info@threesigma.xyz).
