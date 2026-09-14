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

### Scoring model

Each day's hourly weather reports are averaged before scoring. Every input is converted to a component score from 0 to 100, and the components are combined with a weighted average. A range score is 100 inside the preferred range and decreases by 10 points for each unit outside it. An inverse score starts at 100 and decreases as an undesirable measurement approaches its maximum. Weather codes use a simpler severity scale: clear is 100, codes 1-3 are 90, fog is 65, rain or showers are 40, snow is 25, and heavier snow is 10.

The activity assumptions and relative weights are:

- **Skiing:** snowfall plus snow depth is the dominant factor (weight 10), followed by apparent temperature (3), precipitation probability (2), wind gusts (2), visibility (1), and general weather conditions (1). The preferred combined snow measurement is 30-200 cm-equivalent, apparent temperature is -8 to 2 C, and visibility is 5-30 km.
- **Surfing:** wind is the strongest signal (weight 4), with wind gusts (2), apparent temperature (2), precipitation probability (1), cloud cover (1), and general weather conditions (1). The preferred wind range is 12-35 km/h and apparent temperature is 12-30 C. This is a weather suitability score, not a full surf forecast, because Open-Meteo does not provide wave height or swell direction in this request.
- **Outdoor sightseeing:** apparent temperature and precipitation probability are weighted most heavily (3 each). Rain or showers, wind gusts, and visibility have weight 2; cloud cover, UV index, humidity, and general weather conditions have weight 1 or 2. The assumptions favor 12-26 C, low precipitation, visibility of 8-30 km, humidity of 30-75%, and moderate UV exposure.
- **Indoor sightseeing:** precipitation probability is the strongest positive signal (weight 4), followed by rain or showers (3), cloud cover (2), wind gusts (2), and smaller contributions from temperature, visibility, and general weather conditions. This treats unpleasant outdoor weather as a reason to prefer indoor activities, while avoiding a perfect score for severe conditions.

Scores are rounded to whole numbers and labeled **Excellent** (80-100), **Good** (60-79), **Fair** (40-59), or **Poor** (0-39). These are deliberately heuristic thresholds rather than claims of scientific precision. The main trade-off is keeping the model understandable and comparable across activities within the time available; a production version would validate the assumptions with users and activity-specific data.

## Frontend

The frontend uses React and TypeScript because React is the tool I know best and can use most effectively. I used React Query to cache client-side requests and provide fast responses when the same search is repeated. This complements the Redis cache in the backend: Redis benefits all API consumers, while React Query avoids unnecessary requests from the browser itself.

I used a router so the application can grow beyond the current view and support additional routes without restructuring the frontend.

## Testing and AI Use

I added unit tests across the backend and frontend, but did not add end-to-end or broader integration tests. For this exercise, I considered the unit coverage sufficient for the implemented domain and application logic. In a production setting, I would add integration tests around the GraphQL boundary, external adapters, caching behavior, and the main browser workflow, potentially with dedicated QA support.

AI assisted with the implementation throughout the exercise. It generated much of the test scaffolding, frontend visual design, CSS, and favicon. I reviewed the generated work, directed it toward the required behavior, and corrected tests that did not accurately represent the intended behavior. The initial ranking implementation was also AI-generated, but it was revised to include more relevant weather parameters and the weight system. The final scoring model is still intentionally simple, but it produces a more useful result than the initial version.

Overall, AI significantly reduced implementation time, particularly for visual work that is outside my strongest skill set.
