# Collinson Weather

A full-stack weather forecast application with a NestJS GraphQL API and a React/Vite web interface.

## Prerequisites

- Docker with Docker Compose
- Git

## Start the project

From the repository root, build and start the development services:

```bash
docker compose up --build
```

The containers install their dependencies automatically on startup. The first build may take a few minutes.

## Open the application

- Web application: http://localhost:5173
- GraphQL API: http://localhost:3000/graphql

The web application already points to the local API by default. To use another API URL, set `VITE_API_URL` in the web environment before starting the frontend.

## Useful commands

Run the services in the background:

```bash
docker compose up --build -d
```

Follow the logs:

```bash
docker compose logs -f
```

Stop the services:

```bash
docker compose down
```

Run the API tests locally:

```bash
yarn test
```

Run the web tests locally:

```bash
yarn --cwd web test --run
```

Run the API and web development servers without Docker:

```bash
yarn start:dev
yarn web:dev
```

When running locally without Docker, open http://localhost:5173 after starting both commands. Redis is available through Docker Compose and is used by the API cache.

# Implementation Notes and Assumptions

## Backend

I chose a hexagonal architecture because it keeps external integrations replaceable. For example, the Open-Meteo adapter could be replaced with another weather provider without changing the application or domain logic, as long as the new adapter implements the relevant port. I do not usually use hexagonal architecture, but I felt it was a useful fit for this exercise because it makes those boundaries explicit.

The backend is built with NestJS, which is the Node.js framework I am most comfortable using. I also added Redis caching for repeated API requests. I chose a one-hour cache duration as a pragmatic assumption for this exercise: weather forecasts can change, but most repeated requests within a short period do not need a fresh upstream call. In a production system, I would validate that duration against forecast accuracy, provider update frequency, and the expected request pattern.

There is no database or user account system. The application is intentionally stateless apart from the cache, so it can be deployed and used without a setup flow or persistent user data. This also keeps the scope focused on forecast retrieval, scoring, and presentation.

## Frontend

The frontend uses React and TypeScript because React is the tool I know best and can use most effectively. I used React Query to cache client-side requests and provide fast responses when the same search is repeated. This complements the Redis cache in the backend: Redis benefits all API consumers, while React Query avoids unnecessary requests from the browser itself.

I used a router so the application can grow beyond the current view and support additional routes without restructuring the frontend.

## Testing and AI Use

I added unit tests across the backend and frontend, but did not add end-to-end or broader integration tests. For this exercise, I considered the unit coverage sufficient for the implemented domain and application logic. In a production setting, I would add integration tests around the GraphQL boundary, external adapters, caching behavior, and the main browser workflow, potentially with dedicated QA support.

AI assisted with the implementation throughout the exercise. It generated much of the test scaffolding, frontend visual design, CSS, and favicon. I reviewed the generated work, directed it toward the required behavior, and corrected tests that did not accurately represent the intended behavior. The initial ranking implementation was also AI-generated, but it was revised to include more relevant weather parameters and the weight system. The final scoring model is still intentionally simple, but it produces a more useful result than the initial version.

Overall, AI significantly reduced implementation time, particularly for visual work that is outside my strongest skill set.
