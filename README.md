# Rent a Room

This project is part of the activities carried out in the Developing Quality Apps course (PROG8061) from September to December 2024.

## Basic Setup

## Package installation
1. To install dependencies, run this command from the project root folder: `npm install`.

### Database
1. If you already have Postgres installed on your system at port 5432, you will need to change the port mapping on `docker-compose.yml` from `5432:5432` to  `5432:5433`, for example. 
2. If that is the first time you are running this application, skip this step. Otherwise, from the project root folder, you will need to run `docker compose down -v` to shutdown the containers and remove the containers.
3. Start the Docker container using the `docker-compose.yml` file located at the root directory: `docker compose up --build -d`. This will launch Postgres, exposing port 5432 to localhost.
4. Create the main database structure by running: `npm run db:setup`.
5. Seed the database with Province and City data: `npm run db:seed`.
6. Create the test database structure by running: `npm run db:test-setup`.

### Node
1. Start the system on port 3000 by running: `npm run dev` or `npx next dev`.

### Tests
1. Run tests using `npm test` or `npm run coverage`.
2. If you're using VS Code, take advantage of the Jest extension by Meta.

#### Tests implemented
As of now, the project includes:
1. Unit tests covering `/src/dto/**`, `src/service/**`, and `src/pages/api/auth/auth.spec.ts`.
2. Integration tests at `/src/__test__/**` to cover 11 scenarios of user and room services uses.

## API Documentation
1. You can find the Postman collection at: [Postman Collection](https://documenter.getpostman.com/view/39012576/2sAXxY5Ux6)
