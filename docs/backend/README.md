# Instructions

## Commands used to create the project structure

- Run these commands only if the Workspace was not created before:
```sh
npx create-nx-workspace projectx --preset=nest
cd projectx
```

- Create auth project:
```sh
npx nx add @nx/nest
npx nx g @nx/nest:app apps/auth --frontendProject web
```

- Create a lib for the business models (DTOs, common types, etc):
```sh
npx nx g @nx/nest:lib libs/models
npm add @nestjs/swagger class-validator class-transformer lodash @2toad/profanity
```

- Create a lib for the database:
```sh
npx nx g @nx/nest:lib libs/backend/db
npm add -D prisma
npm add @prisma/client
cd libs/backend/db
npx prisma init
```

- Create a lib for sending emails:
```sh
npx nx g @nx/nest:lib libs/backend/email
```

- Create a lib for backend utils (hashing functions, nestjs and temporal utils, etc):
```sh
npx nx g @nx/nest:lib libs/backend/utils
npm add -D @types/bcrypt
npm add bcrypt @nestjs/config body-parser helmet express-rate-limit
```

- Install dependencies for authentication
```sh
npm add @nestjs/jwt @nestjs/passport passport passport-local passport-jwt
npm add -D @types/passport-local @types/passport-jwt
```

More details [here](https://nx.dev/recipes/react/remix).
