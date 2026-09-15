# ATLAS Reproducible Analysis Platform

A lightweight, full-stack scientific computing demonstrator for
reproducible computational analysis using **ATLAS Open Data**.

Inspired by CERN's **REANA (Reusable Analysis Platform)** architecture,
this project combines modern web technologies, containerization, and
High Energy Physics (HEP) data access. It wraps the
[`atlasopenmagic`](https://github.com/atlas-outreach-data-tools/atlasopenmagic)
Python package into an interactive, end-to-end reproducible analysis
workflow.

## Overview

The ATLAS Reproducible Analysis Platform provides a practical
demonstration of how scientific data workflows can be exposed through a
modern web interface while preserving the information required to
reproduce an analysis.

The platform supports:

-   Discovering ATLAS Open Data datasets.
-   Inspecting Monte Carlo dataset metadata.
-   Resolving data-streaming URLs across supported protocols, including
    `https`, `root`, and `eos`.
-   Generating explicit reproducibility manifests.
-   Running the application as containerized services.
-   Preparing the platform for Kubernetes-based deployment.

## Key Features

### ATLAS Open Data Integration

Native integration with
[`atlasopenmagic`](https://github.com/atlas-outreach-data-tools/atlasopenmagic)
enables the platform to discover ATLAS datasets, inspect metadata, and
resolve streaming URLs across multiple protocols.

### Reproducibility Manifest Generation

Each analysis request produces an explicit manifest containing:

-   A unique analysis identifier.
-   Dataset identifiers.
-   ATLAS release information.
-   Execution parameters.
-   Software versions.
-   A UTC creation timestamp.

This information makes analysis inputs and execution settings
transparent, traceable, and suitable for re-execution in another
environment.

### Modern Full-Stack Architecture

The application consists of:

-   A **React + Vite** frontend for interactive workflow submission and
    visualization.
-   A **FastAPI** backend for asynchronous API handling and request
    validation.
-   A Python-based analysis engine powered by `atlasopenmagic`.

### Containerized Deployment

The complete application can be launched locally using **Docker
Compose**, with separate services for the frontend and backend.

### Kubernetes Readiness

The repository includes Kubernetes manifests for deploying the backend
and related services to a cluster, such as Minikube or a compatible
cloud infrastructure environment.

## Architecture

``` text
┌─────────────────────────────────────────────┐
│              React Frontend                 │
│                  Vite                       │
└──────────────────────┬──────────────────────┘
                       │
                       │ POST /analysis
                       │ JSON request
                       ▼
┌─────────────────────────────────────────────┐
│              FastAPI Backend                │
│       Python 3.12 · Pydantic · Uvicorn      │
└──────────────────────┬──────────────────────┘
                       │
                       │ Python API / CLI
                       ▼
┌─────────────────────────────────────────────┐
│          atlasopenmagic Engine              │
└──────────────────────┬──────────────────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
┌──────────────────────┐ ┌─────────────────────┐
│ Dataset Metadata &   │ │ Reproducibility     │
│ Streaming URLs       │ │ Manifest Generation │
└──────────────────────┘ └─────────────────────┘
```

## Technology Stack

  -----------------------------------------------------------------------
  Domain                              Technologies
  ----------------------------------- -----------------------------------
  Frontend                            React, Vite, Modern CSS3

  Backend                             Python 3.12, FastAPI, Pydantic,
                                      Uvicorn

  Scientific Data Access              `atlasopenmagic`, ATLAS Open Data

  Containerization                    Docker, Docker Compose

  Deployment                          Kubernetes manifests

  Scientific Domain                   High Energy Physics, Monte Carlo
                                      datasets, reproducible analysis
                                      workflows

  Architecture Inspiration            CERN REANA
  -----------------------------------------------------------------------

## Repository Structure

``` text
.
├── frontend/                 # React + Vite application
├── backend/                  # FastAPI service and analysis engine
├── k8s/                      # Kubernetes deployment manifests
├── docker-compose.yml        # Local multi-service orchestration
├── README.md                # Project documentation
└── ...
```

> The exact directory structure may vary depending on the
> implementation. Update the paths above if your repository uses
> different names.

## Getting Started

### Prerequisites

Install the following tools before running the platform:

-   [Docker Engine](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)
-   Git

### Clone the Repository

Replace the placeholder repository URL with your actual GitHub
repository:

``` bash
git clone https://github.com/YOUR_GITHUB_USERNAME/atlas-repro-analysis.git
cd atlas-repro-analysis
```

### Launch the Application

Build and start all services using Docker Compose:

``` bash
docker compose up --build
```

To run the services in detached mode:

``` bash
docker compose up --build -d
```

### Access the Application

Once the services are running, open:

  --------------------------------------------------------------------------
  Service                             URL
  ----------------------------------- --------------------------------------
  Frontend Dashboard                  <http://localhost:3000>

  FastAPI Swagger Documentation       <http://localhost:8000/docs>

  FastAPI OpenAPI Schema              <http://localhost:8000/openapi.json>
  --------------------------------------------------------------------------

To stop the application:

``` bash
docker compose down
```

## Reproducibility Manifest

When an analysis job is submitted through the web interface or API, the
platform generates an immutable-style execution manifest containing the
dataset, release, parameters, software version, and creation time.

Example:

``` json
{
  "analysis_id": "8f3b14a2-11e2-4113-912b-34f102bc9212",
  "dataset": {
    "id": "301204",
    "release": "2024r-pp"
  },
  "parameters": {
    "max_events": 20000
  },
  "software": {
    "atlasopenmagic": "0.1.0"
  },
  "created_at": "2026-09-09T14:30:00.000000+00:00"
}
```

The manifest records the computational context required to understand
and reproduce a workflow, including:

-   The target dataset.
-   The relevant ATLAS release.
-   Analysis execution parameters.
-   The software version used by the analysis engine.
-   The UTC timestamp associated with the request.

## API

The backend exposes an interactive OpenAPI interface through FastAPI.

### Submit an Analysis

``` http
POST /analysis
Content-Type: application/json
```

Example request:

``` json
{
  "dataset_id": "301204",
  "release": "2024r-pp",
  "max_events": 20000
}
```

The exact request and response schemas are defined by the backend's
Pydantic models and are available at:

``` text
http://localhost:8000/docs
```

## Kubernetes Deployment

Kubernetes manifests are located in the `k8s/` directory.

Apply the deployment manifest:

``` bash
kubectl apply -f k8s/deployment.yaml
```

Inspect the deployment:

``` bash
kubectl get deployments
```

Inspect the services:

``` bash
kubectl get services
```

For a local Kubernetes environment such as Minikube, ensure that the
cluster is running before applying the manifests:

``` bash
minikube status
```

The Kubernetes configuration may require environment-specific
adjustments, including:

-   Container image names.
-   Service types.
-   Resource requests and limits.
-   Environment variables.
-   Ingress or networking configuration.
-   Registry credentials.

## Reproducibility Principles

This demonstrator is designed around several reproducible-analysis
principles:

1.  **Explicit inputs** --- Dataset identifiers and release versions are
    recorded.
2.  **Traceable parameters** --- Execution settings are captured in the
    manifest.
3.  **Version awareness** --- Software versions are included in the
    execution context.
4.  **Portable execution** --- Docker provides a consistent runtime
    environment.
5.  **Deployment flexibility** --- Kubernetes manifests support
    cluster-based execution.
6.  **Scientific transparency** --- Metadata and workflow information
    are exposed through a documented API.

## Project Motivation

Scientific analyses often depend on a combination of datasets, software
versions, execution parameters, and infrastructure. Without recording
these dependencies explicitly, reproducing a result can become
difficult.

This project demonstrates a REANA-inspired approach in which scientific
data access and computational workflow metadata are integrated into a
modern, containerized application. It serves as a compact example of how
HEP analysis workflows can be made more transparent, portable, and
reproducible.

## Related Projects and Resources

-   [CERN REANA](https://reanahub.io/)
-   [ATLAS Open Data](https://opendata.atlas.cern/)
-   [`atlasopenmagic`](https://github.com/atlas-outreach-data-tools/atlasopenmagic)
-   [FastAPI Documentation](https://fastapi.tiangolo.com/)
-   [React Documentation](https://react.dev/)
-   [Docker Documentation](https://docs.docker.com/)
-   [Kubernetes Documentation](https://kubernetes.io/docs/)

## Development Notes

This repository is a demonstrator and may require additional
configuration before production deployment.

Before using it in a production environment, consider adding:

-   Authentication and authorization.
-   Persistent storage for manifests and analysis records.
-   Background job execution and queue management.
-   Structured logging and monitoring.
-   Automated tests and continuous integration.
-   Resource limits and workload isolation.
-   Secure secret and configuration management.
-   Dataset and software provenance validation.


