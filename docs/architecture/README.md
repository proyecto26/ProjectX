# Project Architecture Overview

This document provides a high-level overview of the ProjectX architecture, a full-stack event-driven application using Temporal workflows and React.

## System Architecture

```mermaid
graph TB
    subgraph Frontend
        Web[Web App - React/React Query]
    end

    subgraph Backend
        Auth[Auth Service]
        Order[Order Service]
        Temporal[Temporal Server]
        DB[(PostgreSQL)]
        Email[Email Service]
        Payment[Payment Service]
    end

    Web --> Auth
    Web --> Order
    Auth --> DB
    Order --> DB
    Order --> Temporal
    Order --> Payment
    Order --> Email
    Auth --> Email
    Payment --> Stripe[Stripe API]
    Email --> SendGrid[SendGrid API]
```

## Event Flow - Payment Processing

```mermaid
sequenceDiagram
    participant C as Client
    participant O as Order Service
    participant T as Temporal
    participant S as Stripe
    participant E as Email Service

    C->>O: Create Order
    O->>T: Start Payment Workflow
    T->>S: Create Payment Intent
    S-->>T: Payment Intent Created
    T->>C: Return Client Secret
    C->>S: Complete Payment
    S->>O: Webhook: Payment Success
    O->>T: Signal Payment Status
    T->>E: Send Confirmation Email
    E-->>C: Email Sent
```

## Service Architecture

### Auth Service (Port 8081)
- JWT-based authentication
- User management
- Session handling

### Order Service (Port 8082)
- Order management
- Payment processing
- Webhook handling
- Temporal workflow orchestration

### Shared Libraries
- `@projectx/core`: Core utilities and configurations
- `@projectx/db`: Database access and models
- `@projectx/email`: Email service integration
- `@projectx/payment`: Payment provider integration
- `@projectx/workflows`: Temporal workflow definitions

## Data Flow

```mermaid
flowchart LR
    subgraph User Flow
        Login --> CreateOrder
        CreateOrder --> ProcessPayment
        ProcessPayment --> SendEmail
    end

    subgraph System Flow
        A[Auth Service] --> D[(Database)]
        O[Order Service] --> D
        O --> T[Temporal]
        T --> P[Payment Service]
        T --> E[Email Service]
    end
```

## Technology Stack
- **Frontend**: React, React Query, TailwindCSS
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL
- **Workflow Engine**: Temporal
- **Payment Processing**: Stripe
- **Email Service**: SendGrid
- **Development Tools**: Docker, Nx Monorepo 