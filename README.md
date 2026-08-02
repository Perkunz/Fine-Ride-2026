Fine Ride Backend

This branch contains an initial scaffold for the backend API (auth, rides, drivers, payments, realtime sockets) using Node.js + Express + Prisma (Postgres).

Quick start

1. Copy .env.example to .env and fill in the values.
2. npm install
3. npm run prisma:generate
4. npm run migrate:dev    # runs prisma migrate (dev)
5. npm run seed
6. npm run dev

Primary design choices
- PostgreSQL + Prisma
- REST endpoints (Express)
- Realtime: socket.io
- Auth: JWT access + refresh tokens
- Maps: Mapbox (server-side)
- Payments: Stripe (webhook skeleton)

Files added in this commit:
- src/ (server, app, routes, controllers, services, middleware, socket)
- prisma/schema.prisma
- prisma/seed.js
- .env.example

Next: implement full controllers, tests, CI and refine schemas.
