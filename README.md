# Rent a Room

This project is part of the activities carried out in the Developing Quality Apps course (PROG8061) from September to December 2024.

As of now, the project includes:
1. Backend services for user creation, upgrading a user account to a property owner (enabling ad posting), user sign-in, room creation, update, and deletion.
2. Unit tests covering `/src/dto/**`, `src/service/**`, and `src/pages/api/auth/auth.spec.ts`.
3. Integration tests at `/src/__test__/**` to cover 11 scenarios of user and room services uses.
4. A login page accessible at `/auth/signin/`.

## Basic Setup

## Package installation
1. To install dependencies, run this command from the project root folder: `npm install`.

### Database
1. If you have setup the application once, from the project root folder, you will need to run `docker compose down -v` to shutdown the containers and remove the containers.
2. Start the Docker container using the `docker-compose.yml` file located at the root directory: `docker compose up --build -d`. This will launch Postgres, exposing port 5432 to localhost.
3. Create the main database structure by running: `npx prisma db push`.
4. Create the test database structure by running: `npm run test:db`.

### Node
1. Start the system on port 3000 by running: `npm run dev`.

### Tests
1. Run tests using `npm test` or `npm run coverage`.
2. If you're using VS Code, take advantage of the Jest extension by Meta.

## API Documentation
1. You can find the Postman collection at: [Postman Collection](https://documenter.getpostman.com/view/39012576/2sAXxY5Ux6)
