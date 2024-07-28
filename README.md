# Description

This is a [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. This application includes authentication, user management, and messaging functionalities, with a PostgreSQL database managed by Prisma.

## Prerequisites

- Node.js (v14.x or later)
- Yarn (v1.x or later)
- Docker (for running RabbitMQ and PostgreSQL containers)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

yarn install
```

## setup

Environment variables
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?schema=public
RABBITMQ_URL=amqp://<username>:<password>@<host>:<port>
JWT_SECRET="unknown"
SENDGRID_API_KEY=SG.xxxxxxxx.yyyyyyyy

```

Running the API with docker
docker-compose up -d

```

Run migration and seed the database
npx prisma migrate dev

```

start in prod
docker run --env-file .env -p 3000:3000 nestjs-app
```

### Without Docker

Ensure you have PostgreSQL and RabbitMQ running locally or remotely and update the .env file with the correct connection strings.

Run migrations and seed the database: `npx prisma migrate dev`

### start application

```
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

```

### Test

# unit tests

$ yarn run test

# e2e tests

```
yarn run pretest:e2e

yarn run test:e2e
```

# test coverage

$ yarn run test:cov

```

```
