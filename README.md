# Backend RESTful API
#### Author: [Emmanuel Yeboah](https://github.com/noelzappy)

The backend RESTful API template for NodeJs. It uses Express, TypeScript, and Prisma ORM with Postgres database. It is a boilerplate for building RESTful APIs with NodeJs and TypeScript.
Bull is used for background jobs and Redis is used for caching. The API is built with security in mind and follows best practices for building RESTful APIs. It is also designed to be easily extensible and maintainable.



## Quick Start

To create a project:

```bash
git clone --depth 1 https://github.com/noelzappy/nodejs-api-template.git backend-api
cd backend-api
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Table of Contents

- [Backend RESTful API](#backend-restful-api)
      - [Author: Emmanuel Yeboah](#author-emmanuel-yeboah)
  - [Quick Start](#quick-start)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Commands](#commands)
  - [Environment Variables](#environment-variables)
        - [This may be updated as development continues.](#this-may-be-updated-as-development-continues)
  - [Project Structure](#project-structure)
  - [API Documentation](#api-documentation)
    - [API Endpoints](#api-endpoints)
    - [Bull Board](#bull-board)
  - [Error Handling](#error-handling)
  - [Validation](#validation)
  - [Authentication](#authentication)
  - [Logging](#logging)
  - [Linting](#linting)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Postgres database**: [Prisma](https://www.prisma.io/) ORM with [Postgres](https://www.postgresql.org/) database. You can easily switch to [MySQL](https://www.mysql.org/) or [SQLite](https://www.sqlite.org/index.html) by changing the configuration.
- **Typescript**: using [TypeScript](https://www.typescriptlang.org/)
- **Express**: using [Express](https://expressjs.com/)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Class Validator](https://github.com/typestack/class-validator)
- **Logging**: using [winston](https://github.com/winstonjs/winston)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Docker support**: with [Docker](https://www.docker.com)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)
- **Git hooks**: with [Husky](https://typicode.github.io/husky/#/)
- **Redis**: caching and background jobs using [Bull](https://github.com/OptimalBits/bull)
- **Zeptomail**: for sending emails using [ZeptoMail](https://www.zeptomail.com/)

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start

# or using docker

docker compose up -d
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Environment Variables
##### This may be updated as development continues.

The environment variables can be found and modified in the `.env.<env>.<tld>` file. They come with these default values:

```bash
NODE_ENV = development

# PORT
PORT = 3003

# TOKEN
SECRET_KEY = MyVeryComplexsecretKey

# APP
CLIENT_URL =https://localhost:3000
API_URL=http://localhost:3003

# REDIS
REDIS_URL=rediss://default:xxxxxxxxxxxxxxxxxx@cache-db-do.m.db.ondigitalocean.com:25061

# Database
DATABASE_URL="postgresql://doadmin:xxxxxxxxxxxxxxx@xxxxxxxxxxxxxxxxx.k.db.ondigitalocean.com:25060/devdb?sslmode=require"

# Bull Board
BULL_BOARD_PASSWORD = 123456
BULL_BOARD_USERNAME = admin

```

## Project Structure
This may change overtime as new folders/files may be introduced

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--database\       # Database connection and migrations and seeds
 |--dtos\           # Data transfer objects (class validator schemas)
 |--http\           # Http related things
 |--interfaces\     # Typescript interfaces
 |--logs\           # Log files
 |--middlewares\    # Custom express middlewares
 |--prisma\         # Prisma client models and seed data
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--test\           # Tests (unit)
 |--utils\          # Utility classes and functions
 |--workers\        # Workers - background jobs
 |--app.ts          # Express app
 |--server.ts        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3003/api-docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the `.swagger.yaml` file.

### API Endpoints
This endpoint may not be upto date, but can be used as reference.

List of available routes:

**Auth routes**:\
`POST /auth/signup` - register\
`POST /auth/login` - login\

**User routes**:\
`POST /users` - create a user\
`GET /users` - get all users\
`GET /users/:userId` - get user\
`PUT /users/:userId` - update user\
`DELETE /users/:userId` - delete user

### Bull Board
The app uses [Bull](https://github.com/OptimalBits/bull) for background jobs and [Bull Board](https://github.com/felixmosh/bull-board) for the UI. To access the Bull Board UI, go to `http://localhost:3003/bull-board` in your browser.
The Bull Board UI is protected with basic authentication. The username and password are defined in the `.env` file as `BULL_BOARD_USERNAME` and `BULL_BOARD_PASSWORD`. You can change them to whatever you want.

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the `catchAsync` utility wrapper, which forwards the error.

```typescript
import catchAsync from '@/utils/catchAsync';

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

The app has a utility `httpException` class to which you can attach a response code and a message, and then throw it from anywhere (`catchAsync` will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```typescript
  import httpStatus from 'http-status';
  import catchAsync from '@/utils/catchAsync';
  import httpException from '@/utils/httpException';
  import prisma from '@/database';

const getUser = async (userId) => {
  const user = await prisma.user.findUnique(userId);
  if (!user) {
    throw new httpException(httpStatus.NOT_FOUND, 'User not found');
  }
};
```



## Validation

Request data is validated using [Class Validator](https://github.com/typestack/class-validator). Check the [documentation](https://github.com/typestack/class-validator) for more details on how to write validation schemas or classes.

The validation classes are defined in the `src/dtos` directory and are used in the routes by providing them as parameters to the `ValidationMiddleware` middleware.

```typescript
import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', ValidationMiddleware(CreateUserDto, 'body'), this.auth.signUp);
    this.router.post('/login', ValidationMiddleware(LoginUserDto, 'body'), this.auth.logIn);
  }
}
```

## Authentication

To require authentication for certain routes, you can use the `AuthMiddleware` middleware.

```typescript
import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    // HERE
    this.router.get(`${this.path}`, AuthMiddleware(), this.user.getUsers);
  }
}
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /auth/register`) or login (`POST /auth/login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 2 days. You can modify this expiration time by changing the `TOKEN_EXPIRES_IN` environment variable in the .env file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /auth/refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for `X + 10` days, where `X` is `TOKEN_EXPIRES_IN` in the .env file.


## Logging

Import the logger from `@utils/logger`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```typescript
import { logger } from '@utils/logger';

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

All log messages are stored in the `src/logs` directory.\


## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc` file. To modify the Prettier configuration, update the `.prettierrc` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).


## License

[MIT](LICENSE)
