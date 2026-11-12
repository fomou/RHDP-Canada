# RHDP Canada

Monorepo for the RHDP Canada association site: a Next.js frontend and a Spring Boot API. The folder `Mockup images` is the visual reference and is not served by the app.

## Layout

| Path | Role |
| --- | --- |
| `frontend/` | Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui |
| `backend/` | Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA |
| `docker-compose.yml` | PostgreSQL 16, the API, and the Next.js app |
| `docs/` | Product planning (MVP issue backlogs) |
| `Mockup images/` | Design reference. Leave this folder as it is. |

MVP 1 (identity & onboarding) fine-grained issues: [`docs/mvp1-issues.md`](docs/mvp1-issues.md).

## Run with Docker Compose

Docker Compose is the intended local stack. It does not create any Azure or AWS resources.

```bash
cp .env.example .env
docker compose up --build
```

- Site: http://localhost:3000
- API health: http://localhost:8080/api/health
- PostgreSQL: `localhost:5432`

`NEXT_PUBLIC_*` values are baked into the frontend image at build time. Change them in `.env`, then rebuild the frontend service.

## Run without Docker

PostgreSQL has to be reachable at `DATABASE_URL` before the API will start.

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev
```

```bash
cd backend
export DATABASE_URL=jdbc:postgresql://localhost:5432/rhdp
export DATABASE_USERNAME=rhdp
export DATABASE_PASSWORD=rhdp_local_dev
export JWT_SECRET=local-dev-only-change-this-secret-key-32b
export STRIPE_SECRET_KEY=sk_test_replace_me
export DEMO_USER_EMAIL=membre@rhdp-canada.local
export DEMO_USER_PASSWORD=rhdp_local_dev
chmod +x mvnw
./mvnw spring-boot:run
```

## Environment variables

Copy `.env.example`. Nothing in the repository is a live credential. The values there are local placeholders.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Postgres container | Database name and login |
| `DATABASE_URL` | API | JDBC URL. Compose points it at the `postgres` service |
| `DATABASE_USERNAME`, `DATABASE_PASSWORD` | API | Database login |
| `JWT_SECRET` | API | HMAC secret for access tokens. At least 32 bytes |
| `JWT_EXPIRATION_SECONDS` | API | Access-token lifetime. Default 3600 |
| `CORS_ALLOWED_ORIGINS` | API | Comma-separated browser origins. Default `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | API | Stripe secret. Placeholder `sk_test_replace_me` never calls Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend | Publishable key placeholder. Not a secret, still not a live key |
| `NEXT_PUBLIC_API_URL` | Frontend | API origin shown on the connexion page. Build-time for Next.js |
| `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`, `DEMO_USER_DISPLAY_NAME` | API | Optional seed. If the password is empty, no demo member is created |

Leave `DEMO_USER_PASSWORD` empty outside your own machine. Hibernate `ddl-auto: update` creates and updates tables on startup for this scaffold. Replace that with versioned migrations before a real production database.

## Authentication

The API uses **stateless JWT access tokens**.

Spring Security is configured with `SessionCreationPolicy.STATELESS`. Login (`POST /api/auth/login`) checks the member row with BCrypt and returns a signed access token. Later requests send `Authorization: Bearer <token>`. The server does not create an HTTP session and does not store the token. The signature is HMAC-SHA256 via JJWT, using `JWT_SECRET`.

That choice keeps the API free of sticky sessions, so more than one instance can sit behind a load balancer. CSRF protection is off because the browser does not send an ambient cookie credential: the caller has to attach the token. This scaffold does not issue refresh tokens and cannot revoke an access token before it expires, so keep `JWT_EXPIRATION_SECONDS` short. A generated in-memory Spring Security user is not used.

Example, after Compose is up and the demo member has been seeded from `.env`:

```bash
curl -s http://localhost:8080/api/health

TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"membre@rhdp-canada.local","password":"rhdp_local_dev"}' \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["accessToken"])')

curl -s http://localhost:8080/api/me -H "Authorization: Bearer $TOKEN"
curl -s -X POST http://localhost:8080/api/payments/intent -H "Authorization: Bearer $TOKEN"
```

| Method | Path | Auth |
| --- | --- | --- |
| `GET` | `/api/health` | Public |
| `POST` | `/api/auth/login` | Public. Body: `email`, `password` |
| `GET` | `/api/me` | Bearer access token |
| `POST` | `/api/payments/intent` | Bearer access token |

The home page and the connexion page validate their forms in the browser only. They do not call the API.

## Stripe

`stripe-java` is on the API classpath. `POST /api/payments/intent` always builds a PaymentIntent for the 60,00 $ CAD membership (6000 cents). It calls Stripe only when `STRIPE_SECRET_KEY` looks like a real secret key. The committed placeholder `sk_test_replace_me` returns a stub (`"mode": "stub"`, `"status": "not_sent"`) and does not open a network call. Do not commit a live or test key from the Stripe Dashboard. Put a real key in the environment of the machine that should create PaymentIntents.

The publishable key is read by the frontend only to show whether it is missing, still the placeholder, or set. The page never prints the key.

## Tests and CI

GitHub Actions (`.github/workflows/ci.yml`) installs and lints the frontend, runs `npm run build`, and runs `./mvnw verify` on the API. API tests use an in-memory H2 database so CI does not need PostgreSQL. The running application still expects PostgreSQL.

```bash
cd frontend && npm ci && npm run lint && npm run build
cd backend && ./mvnw -B -ntp verify
```

## Production hosting

This repository does not provision a cloud account. The same Spring Boot jar and a PostgreSQL database can be deployed later, with the environment variables above, to either:

- **Azure:** the API on Container Apps or App Service, the database on Azure Database for PostgreSQL.
- **AWS:** the API on ECS, App Runner, or Elastic Beanstalk, the database on Amazon RDS for PostgreSQL.

Point `DATABASE_URL` at that database, set a unique `JWT_SECRET` of at least 32 bytes, and supply Stripe keys only in the host environment. The Next.js app can be hosted separately; rebuild it when `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_API_URL` changes.
