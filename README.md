# Rent a Room

This project is part of the activities carried out in the Developing Quality Apps course (PROG8061) from September to December 2024.

As of now, the project includes:
1. Backend services for user creation, upgrading a user account to a property owner (enabling ad posting), and user sign-in.
2. Unit tests covering `/src/dto/**`, `src/service/**`, and `src/pages/api/auth/auth.spec.ts`.
3. A login page accessible at `/auth/signin/`.

## Basic Setup

### Database
1. Start the Docker container using the `docker-compose.yml` file located at the root directory: `docker compose up`. This will launch Postgres, exposing port 5432 to localhost.
2. Create the database structure by running: `npx prisma db push`.

### Node
1. Install dependencies: `npm install`.
2. Start the system on port 3000 by running: `npm run dev`.

### Tests
1. Run tests using `npm test` or `npm run coverage`.
2. If you're using VS Code, take advantage of the Jest extension by Meta.

## API Documentation
1. You can find the Postman collection at: [Postman Collection](https://documenter.getpostman.com/view/39012576/2sAXxY5Ux6)
