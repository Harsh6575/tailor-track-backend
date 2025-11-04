# 🧵 Tailor Track Backend

A modern and scalable backend service built with **Node.js**, **Express**, **TypeScript**, and **Drizzle ORM**.  
Includes complete developer tooling — linting, formatting, testing, and commit conventions — for a clean and maintainable workflow.

---

## 🚀 Tech Stack

- **Runtime:** Node.js (ESM)
- **Language:** TypeScript
- **Framework:** Express
- **ORM:** Drizzle ORM (PostgreSQL / SQLite)
- **Database Driver:** Better SQLite3
- **Validation:** Zod
- **Auth:** JSON Web Tokens (JWT)
- **Testing:** Vitest + Supertest
- **Linting & Formatting:** ESLint + Prettier
- **Git Hooks:** Husky + Lint-Staged
- **Commit Messages:** Commitizen + Commitlint
- **Logging:** Winston

---

## ⚙️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/harsh6575tailor-track-backend.git
cd tailor-track-backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Create a .env file in the project root:

```env
NODE_ENV=production
PORT=4000

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tailor_db

PGADMIN_DEFAULT_EMAIL=admin@tailortrack.com
PGADMIN_DEFAULT_PASSWORD=admin

DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}


ACCESS_TOKEN_SECRET=af4204c892324293e4b1cc39e4d8889365b9755a745629a6854df01ef06a6d5a4f159cef21e72c9f62bc9c048e3d617337de1f9caf5d00011b158b209df58da5
REFRESH_TOKEN_SECRET=da1accad219e87784afd4df91b316ee0783b3c522fd6a076384ae2f446e52e6209e4896641c919431091e7dd94450391612b6e0d6ad772647a8c22a8b3b2c2ca
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

---

## 🧩 Available Scripts

| Command               | Description                              |
| --------------------- | ---------------------------------------- |
| pnpm dev              | Start the server in watch mode using tsx |
| pnpm build            | Build the project with TypeScript        |
| pnpm start            | Run the compiled server from dist/       |
| pnpm lint             | Lint and fix code with ESLint            |
| pnpm lint:check       | Check lint issues without fixing         |
| pnpm format           | Format code using Prettier               |
| pnpm test             | Run all tests using Vitest               |
| pnpm test:watch       | Run tests in watch mode                  |
| pnpm test:coverage    | Run tests with coverage report           |
| pnpm drizzle:generate | Generate SQL migrations using Drizzle    |
| pnpm drizzle:migrate  | Push database migrations                 |
| pnpm drizzle:studio   | Open Drizzle Studio for DB visualization |

---

## 🧠 Testing

We use **Vitest and Supertest** for testing.

Example test (`src/__tests__/app.test.ts`):

```javascript
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server";

describe("GET /", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
```

Run tests:

```bash
pnpm test
```

---

## 🧹 Code Quality

- ESLint – catches errors and enforces consistent code style
- Prettier – automatically formats your code
- Husky + Lint-Staged – runs checks before each commit
- Commitizen + Commitlint – ensures conventional commits

Commit example:

```bash
pnpm commit
# e.g., feat(auth): add token refresh endpoint
```

---

## 🗂️ Project Structure

```lua
tailor-track-backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── db/
│   ├── utils/
│   └── server.ts
├── drizzle.config.ts
├── tsconfig.json
├── vitest.config.ts
├── .eslintrc.ts
├── .prettierrc
├── .husky/
└── package.json
```

---

## 🧵 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Harsh Vansjaliya
Software Developer
[🔗 Portfolio](https://harsh-vansjaliya.vercel.app)

[📧 harshvansjliaya3@gmail.com](mailto:harshvansjaliya3@gmail.com)
