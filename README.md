# Pharma CRM

**[Video walkthrough](https://www.loom.com/share/3f3117e1c85e4c648131b23f68053392)**

A CRM for pharmaceutical medical representatives. Reps can search and browse
contacts, filter by organization type or city, view the organization each
contact belongs to, read a contact's activity timeline, log new activities
(visit description, optional medicine discussed, and a follow-up date), and
track open follow-ups on a dedicated dashboard.

Organizations are one of three types: **hospital**, **retail store**, or
**private doctor**.

This is Phase 1: core data model, API, and UI. No authentication yet — see
[Roadmap](#roadmap).

## Features

- **Contact directory** — search by name or organization, filter by
  organization type and by city.
- **Organization directory** — hospitals, retail stores, and private doctors,
  filterable by city, each with its own roster of contacts.
- **Activity timeline** — every logged visit against a contact, with an
  optional medicine and follow-up date.
- **Medicine catalog** — a shared, autocomplete-searchable list of medicines
  used across every activity log.
- **Follow-up dashboard** — open follow-ups grouped into Overdue, Due Today,
  Due This Week, and Upcoming, with at-a-glance counts for each.
- **Dark mode** — a light/dark toggle in the nav bar, remembered per browser.

## Setup instructions

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- (Optional) PostgreSQL, if you don't want to use the default SQLite setup

### Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
python -m app.seed            # creates crm.db and loads sample data
```

By default the backend uses SQLite (`crm.db`, gitignored). To point at
Postgres instead, copy `.env.example` to `.env` and set `DATABASE_URL`.

### Frontend

```bash
cd frontend
npm install
```

## How to run the project locally

Run both servers in separate terminals.

**Backend** (from `backend/`, with `.venv` activated):

```bash
uvicorn app.main:app --reload --port 8000
```

API at `http://127.0.0.1:8000`, interactive docs at
`http://127.0.0.1:8000/docs`.

**Frontend** (from `frontend/`):

```bash
npm run dev
```

App at `http://localhost:5173`. It talks to the backend directly at
`http://127.0.0.1:8000` — make sure that's running first.

## Stack choices

- **Backend — FastAPI + SQLAlchemy + Pydantic.** FastAPI gives request/response
  validation and interactive API docs for free from type hints, which matters
  more than a full-batteries framework like Django when the whole app is one
  API with no admin panel or templating needs. SQLAlchemy is the ORM layer;
  Pydantic schemas (`schemas.py`) keep the API's input/output shapes separate
  from the database models (`models.py`) on purpose, so a client can never set
  server-generated fields like `id` or `created_at`.
- **Database — SQLite for local dev, Postgres-ready for deployment.**
  `DATABASE_URL` is the only thing that changes between the two — the app
  never hardcodes which database it's talking to.
- **Frontend — React + TypeScript + Vite + React Router.** A single-page app
  with client-side routing, no server-side rendering needed for an internal
  CRM tool. Plain `fetch` through one typed client (`api.ts`) instead of a
  data-fetching library — the API surface is small enough that React Query or
  SWR would be more abstraction than the project needs.
- **Styling — plain CSS with custom-property tokens**, not Tailwind or a
  component library. Every color is a CSS variable, redefined per theme, which
  is what makes the dark/light toggle a single attribute flip instead of a
  duplicated stylesheet.
- **Linting — oxlint** (Rust-based) instead of ESLint, for faster feedback in
  a small frontend.

## Data model

```
Organization (hospital | retail_store | private_doctor)
  └── Contact (many per organization)
        └── Activity (many per contact)
              └── Medicine (optional, from a shared catalog)
```

A private doctor is modeled as an `organization` of type `private_doctor`
with a single contact — one uniform model instead of special-casing.

## Project structure

```
backend/
  app/
    main.py                FastAPI app, CORS, router mounts
    database.py             engine / session / Base
    models.py                SQLAlchemy models
    schemas.py                 Pydantic request/response models
    crud.py                      query helpers (search, cities, follow-ups, pagination)
    routers/                       organizations, contacts, medicines, activities
    seed.py                          sample data for local dev
frontend/
  src/
    api.ts                  typed fetch client for the backend
    pages/                    ContactList, ContactDetail, NewContact,
                               OrganizationList, OrganizationDetail,
                               MedicineList, FollowUps
    components/                Nav, ActivityForm, Timeline
```

## API surface

| Method | Path                                | Purpose                                     |
|--------|-------------------------------------|----------------------------------------------|
| GET    | `/contacts?q=&type=&city=&limit=&offset=` | search / browse contacts, filterable by city |
| GET    | `/contacts/{id}`                    | contact + organization + activity timeline   |
| POST   | `/contacts`                         | create a contact                             |
| GET    | `/organizations?city=&type=`        | list organizations, filterable by city       |
| POST   | `/organizations`                    | create an organization                       |
| GET    | `/organizations/{id}`               | organization + its contacts                  |
| GET    | `/organizations/cities`             | distinct list of cities in use               |
| GET    | `/medicines?q=`                     | medicine autocomplete                        |
| POST   | `/medicines`                        | add a medicine                               |
| POST   | `/contacts/{id}/activities`         | log an activity against a contact            |
| GET    | `/follow-ups?due_before=`           | activities with an open follow-up date       |

## Deployed app link

Not deployed — this runs locally only for now (see
[Setup instructions](#setup-instructions) above).

## A note on AI tool usage

Two tools, two different jobs:

- **ChatGPT** — architecture and design decisions: the data model (why a
  private doctor is an organization rather than a special case), the API
  surface, and feature scoping.
- **Claude Code** — coding and implementation: scaffolding the FastAPI +
  SQLAlchemy backend and the React + Vite frontend, building each feature
  (dark mode, the city filter, the follow-up dashboard) as a reviewed,
  incremental change landed in its own commit, and writing this
  documentation.

Every change was read, smoke-tested (typecheck, lint, live requests against
the running servers), and reviewed before being committed — nothing here was
generated and merged unread.

## Roadmap

- **Phase 2:** rep accounts + auth; activities attribute to the logged-in rep
  (`activities.rep_id` already exists on the schema for this).
- ~~**Phase 3:** follow-up dashboard.~~ Shipped — see [Features](#features).
- **Phase 4:** reporting (activity volume per medicine / org type), medicine
  catalog admin.

## Client presentation

[Claude Artifact walkthrough](https://claude.ai/code/artifact/362c482d-7dca-437d-8c8e-6b3c8d510402)
— a stakeholder-facing overview of the stack, data model, and a guided demo
journey through the app.
