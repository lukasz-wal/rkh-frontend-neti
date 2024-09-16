# Filecoin Plus - Backend

[![License: MIT][license-badge]][license]

[license]: LICENSE.md
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

![banner](./img/banner.png)

> 🚧 **Warning:** This project is currently WIP, the information provided may be outdated.

This repository contains the source code for the backend service responsible for managing the Filecoin Plus program.

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
| `GITHUB_OWNER`           | Owner of the GitHub repository                                           | `fidlabs`                        |
| `GITHUB_REPO`            | Name of the GitHub repository                                            | `filecoin-plus-backend`          |
| `AIRTABLE_API_KEY`       | API key for accessing the Airtable API                                   | `pat*******************`         |
| `AIRTABLE_BASE_ID`       | ID of the Airtable base                                                  | `app*******************`         |
| `AIRTABLE_TABLE_NAME`    | Name of the Airtable table                                               | `tbl*******************`         |
| `LOTUS_RPC_URL`          | URL for connecting to the Lotus RPC API                                  | `http://localhost:1234/rpc/v0`   |
| `LOTUS_AUTH_TOKEN`       | Token for authenticating with the Lotus RPC API                          | `lotus_token_*****************`  |

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
