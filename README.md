# ProjectX

<p align="center">
  <img width="100px" alt="Nx for Monorepo" src="https://nx.dev/favicon/favicon.svg">
  <img width="100px" alt="Remix for Website" src="https://remix.run/favicon-192.png">
  <img width="300px" alt="ProjectX logo" src="https://github.com/user-attachments/assets/eecd8520-1e78-4ec7-8a12-55b62e5771c6">
  <img width="100px" alt="NestJS for Services" src="https://nestjs.com/logo-small-gradient.76616405.svg">
  <img width="100px" alt="Temporal for Durable Executions" src="https://s3.amazonaws.com/media-p.slid.es/uploads/128659/images/11123439/pasted-from-clipboard.png">
</p>

> **ProjectX** is a comprehensive full-stack template designed to simplify the development of scalable and resilient applications using **React** and **Temporal**. By integrating Temporal’s advanced workflow orchestration with React’s dynamic frontend framework, ProjectX enables developers to build applications with durable executions and seamless communication between services.

## Notable Temporal Links

- [Get started with Temporal and TypeScript](https://github.com/temporalio/sdk-typescript)

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

**Temporal** is introduced here as a **Workflow Orchestration** tool for managing long-running operations **(durable execution)**, humans in the loop and system lifecycle **(state management, guaranteed completion with compensations and uniqueness)**. 
You can use **Temporal** today for implementing a sequence of steps/actions in certain order for your business processes **(workflows)**, 
not only for communication between services **(Microservices Orchestration)** but also for **Monolith** apps. 
**Workflows** can react to async and external events **(signals, updates)**, aggregating data and then doing some actions **(activities)** with exponential retries **(retry policy)** and run for extended periods **(heartbeat)** if needed, then you can check the state of these executions at any time **(queries)**.
Additionally, workflows support scheduled and time-based executions with configurable delays for recurring business logic **(scheduling)**.

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
npm add --global nx@latest
```

### Documentation 📚

- **FrontEnd:**
Commands used to create the project structure (Nx, RemixJS, etc) [here](./docs/frontend/README.md).

- **BackEnd:**
Commands used to create the services (NestJS, Temporal, etc) [here](./docs/backend/README.md).

## Usage

### Monorepo

Instructions to use Nx CLI [here](./docs/NX_README.md).

For more information on using Nx, refer to the [Nx documentation](https://nx.dev/getting-started/intro).

### Project Structure Overview

<img width="1643" alt="image" src="https://github.com/user-attachments/assets/82e99efc-640d-4ba4-a485-c92c0184f473">


<details>
  <summary><b>Markmap format 🍬</b></summary>

```markmap
#### Root Directory

- **package.json**: Contains the dependencies and scripts for the entire monorepo.
- **nx.json**: Configuration for Nx, which manages the monorepo structure and build processes.
- **tsconfig.base.json**: Base TypeScript configuration shared across the project.

#### Apps

- **apps/auth**: 
  - **Purpose**: Handles user authentication and data retrieval.
  - **Key Features**: Login, registration, and user profile management.

- **apps/order**: 
  - **Purpose**: Manages order processing, checkout, and payment handling.
  - **Key Features**: Cart management, order tracking, and payment integration.

- **apps/web**: 
  - **Purpose**: The main web application interface.
  - **Key Features**: User interaction with the system.
  - **Configuration**: 
    - **tsconfig.json**: TypeScript configuration specific to the web app.

#### Libs

- **libs/backend/core**: 
  - **Purpose**: Contains business logic and common utilities.
  - **Key Features**: Shared functions and services used across backend applications.

- **libs/backend/db**: 
  - **Purpose**: Manages database access using Prisma and the Repository pattern.
  - **Key Features**: Database schema definitions and data access layers.
  - **Documentation**: 
    - **README.md**: Provides details on database setup and usage.

- **libs/backend/email**: 
  - **Purpose**: Handles email template creation and sending.
  - **Key Features**: Uses MJML for templates and provides email sending services.

- **libs/models**: 
  - **Purpose**: Defines DTOs and common types.
  - **Key Features**: Ensures consistency across web and backend services.

- **libs/frontend/ui**: 
  - **Purpose**: Contains UI components and themes.
  - **Key Features**: Built with React and TailwindCSS, includes Storybook for component visualization.
  - **Configuration**: 
    - **package.json**: Dependencies and scripts for the UI library.
    - **tsconfig.json**: TypeScript configuration for the UI library.

#### Additional paths

- **prompts**: Contains initial project prompts or guidelines to be used with your AI tools (Cursor, etc).
```
</details>

### Run the web app

```sh
npm run dev:web
```

### Run the ui lib (See all the UI components)

```sh
npm run storybook
```

### Run services with Docker Compose

- Build the images:
```sh
docker-compose build --no-cache
```

- Run the services:
```sh
docker-compose up -d
```

- Delete the services: 
```sh
docker-compose down --volumes
```

## Explore the project

```sh
npx nx show projects
npx nx graph
```

View the Database diagram [here](./libs/backend/db/README.md).

Do you want to change the path of a project to decide your own organization? No problem:
```sh
npx nx g @nx/workspace:move --project core libs/backend/common
```

## Update project

```sh
npx nx migrate latest
npx nx migrate --run-migrations
```

## Docker

- Images:
  * https://registry.hub.docker.com/r/postgis/postgis/
  * https://registry.hub.docker.com/r/temporalio/auto-setup
  * https://registry.hub.docker.com/r/temporalio/admin-tools
  * https://registry.hub.docker.com/r/temporalio/ui

You can see all the images needed to run this project in development in the [docker-compose.yml](./docker-compose.yml) file.

## Supporting 🍻
I believe in Unicorns 🦄
Support [me](http://www.paypal.me/jdnichollsc/2), if you do too.

Donate **Ethereum**, **ADA**, **BNB**, **SHIBA**, **USDT/USDC**, **DOGE**, etc:

> Wallet address: jdnichollsc.eth

Please let us know your contributions! 🙏

## Happy coding 💯
Made with ❤️

<img width="150px" src="https://avatars0.githubusercontent.com/u/28855608?s=200&v=4" align="right">
