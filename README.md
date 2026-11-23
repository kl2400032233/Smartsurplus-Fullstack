# SmartSurplus Fullstack Project

This workspace contains the Next.js frontend and Spring Boot backend in one project folder.

## Project structure

- `frontend/ smartsurplus-main/` – Next.js 14 + React frontend
- `backend/ fsad_backend-main/` – Java 17 + Spring Boot + Spring Data JPA + MySQL backend

## Prerequisites

- Node.js 18 or later and npm
- Java 17
- MySQL Server
- Maven (or use the included Maven wrapper)

## 1. Create the database

Start MySQL and run:

```sql
CREATE DATABASE smartsurplus;
```

The default local database settings are:
- URL: `jdbc:mysql://localhost:3306/smartsurplus`
- Username: `root`
- Password: `root`

If your MySQL credentials differ, set `DB_USERNAME` and `DB_PASSWORD` environment variables before starting the backend, or edit `backend/fsad_backend-main/src/main/resources/application.properties`.

## 2. Start the Spring Boot backend

Open a terminal in `backend/fsad_backend-main`:

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

macOS/Linux:

```bash
./mvnw spring-boot:run
```

The backend runs at `http://localhost:8080`.

Check it by opening `http://localhost:8080/`. It should return:

`Backend is running successfully!`

## 3. Start the Next.js frontend

Open a second terminal in `frontend/smartsurplus-main`:

```bash
npm install
```

Copy `.env.local.example` to `.env.local` (the default API URL is already `http://localhost:8080`), then run:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000`.

## 4. Test the integrated workflow

1. Open `http://localhost:3000/register`.
2. Register a Food Donor account.
3. Open the Donor dashboard and go to **My Donations**.
4. Add a donation with a food name and numeric quantity.
5. Log out and register a Recipient Organization account with a different email.
6. Open **Browse Available**, then request the donation.
7. Open **My Requests** to see the request saved by the backend.
8. Register an Admin account to view donations and change donation statuses.

## Connected API endpoints

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/donations`
- `GET /api/donations`
- `PUT /api/donations/{id}/status?status=...`
- `POST /api/requests`
- `GET /api/requests`

## Important implementation notes

- Frontend registration and login now call the Spring Boot API.
- User passwords are hashed with BCrypt before being saved. Passwords are not returned in API responses or stored in browser local storage.
- Donation creation/listing/status updates use the backend API.
- Organization browse/request pages use backend donations and request APIs.
- Requests record the requesting organization's name/email and the related donation ID.
- The current backend is a learning/demo API. It does not yet implement JWT/session authentication or server-side role-based authorization. The frontend's local user object is for UI display only; do not deploy this version publicly as a production system.
- The backend currently stores donation quantity as an integer. The frontend therefore asks for a numeric quantity (unit can be specified in the food description if needed).
- Existing accounts created before BCrypt was added may have plain-text passwords in the database. For a clean test, use a fresh local database or delete those old test users and register again.

## Admin features added

- Organizations: `GET /api/organizations`, `POST /api/organizations`, and `PUT /api/organizations/{id}/status`.
- Users: `GET /api/users` and `POST /api/users/invite`.
- Admin organization and user pages now load data from the Spring Boot API instead of fixed demo arrays.
- Organization creation stores a Pending organization in MySQL. Admins can update its status from the table.
- User invitation creates a Pending user record. **Email delivery is not configured**, so this endpoint does not send an email or provide an activation link.

The admin APIs in this student project currently do not have server-side admin authentication/authorization. Do not expose this build publicly or use real personal data until authentication and authorization are added.
