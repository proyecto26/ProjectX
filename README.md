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

To see all available commands and options:
```sh
nx help
```

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

