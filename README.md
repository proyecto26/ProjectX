# Temporal Workshop for CityJS

## Notable Temporal Links

- [Get started with Temporal and TypeScript]()

### Public Courses

- [Temporal 101 with TypeScript](https://temporal.talentlms.com/catalog/info/id:135)
- [Temporal 102: Exploring Durable Execution with TypeScript](https://temporal.talentlms.com/catalog/info/id:165)
- [Versioning Workflows with TypeScript](https://temporal.talentlms.com/catalog/info/id:171)
- [Interacting with Workflows with TypeScript](https://temporal.talentlms.com/catalog/info/id:207)
- [Securing Temporal Applications with TypeScript](https://temporal.talentlms.com/catalog/info/id:211)
- [Introduction to Temporal Cloud](https://temporal.talentlms.com/catalog/info/id:144)

## Why Temporal?

### Challenges of Maintaining State in Distributed Systems

- Consistency
- Fault Tolerance
- Scalability
- Concurrency Control
- Security

**Temporal** is introduced here as a proposal of Workflow Orchestration for managing long-running operations **(durable execution)**, humans in the loop and system lifecycle **(state management, guaranteed completion with compensations and uniqueness)**. 
You can use **Temporal** today for implementing sequence actions in certain order for any business logic, not only for communication between services **(Microservices Orchestration)** but also for **Monolith** apps. 
**Workflows** can react to async and external events **(signals, updates)**, aggregating data and then doing some actions with exponential retries **(activities)** and run for extended periods (heartbeat), then you can check the state of these executions at any time **(queries)**. Also we can have periodic executions for business logic with time based and delays **(scheduling)**.

### Use Cases

•	**Order Processing Systems:** Managing the lifecycle of orders from placement to fulfillment, including inventory checks, payment processing, and shipping.
•	**User Onboarding:** Coordinating steps involved in onboarding new users, such as account creation, email verification, and initial setup tasks.
•	**Data Pipelines:** Orchestrating data ingestion, transformation, and storage processes with reliability and scalability.
•	**Batch Processing:** Handling large-scale batch jobs with retry mechanisms and progress monitoring.

## Setting Up

### Requirements 🧰

- [Node.js LTS Version](https://nodejs.org)
- [Git](https://git-scm.com/downloads)
- [Docker Compose](https://docs.docker.com/compose/install)
- Code editor: 
  - [VSCode](https://code.visualstudio.com/)
  - [Cursor](https://www.cursor.com/)

### From Linux/Mac 

- Install Homebrew
- Install tools using Homebrew:
```sh
brew install node
brew install git
brew install docker-compose
npm install -g nx
```

### Installation 📚

- FrontEnd:
Commands used to create the project structure [here](./docs/frontend/README.md).


## Usage

### Monorepo

Instructions to use Nx CLI [here](./docs/NX_README.md).

For more information on using Nx, refer to the [Nx documentation](https://nx.dev/getting-started/intro).

### Run the web app

```sh
npm run build
npm run dev:web
```

### Run the ui lib

```sh
npm run storybook
```

