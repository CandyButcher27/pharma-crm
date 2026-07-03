# Pharma CRM

A CRM for pharmaceutical medical representatives. Reps can search and browse
contacts, view the organization each contact belongs to, read a contact's
activity timeline, and log new activities (visit description, optional
medicine discussed, and a follow-up date).

Organizations are one of three types: **hospital**, **retail store**, or
**private doctor**.

This is Phase 1: core data model, API, and UI. No authentication yet — see
[Roadmap](#roadmap).

## Stack

- **Backend:** FastAPI + SQLAlchemy. SQLite for local dev, PostgreSQL-ready
  for deployment (swap via `DATABASE_URL`).
- **Frontend:** React + TypeScript (Vite), React Router.

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
    main.py            FastAPI app, CORS, router mounts
    database.py         engine / session / Base
    models.py            SQLAlchemy models
    schemas.py            Pydantic request/response models
    crud.py                 query helpers (search, follow-ups, pagination)
    routers/                organizations, contacts, medicines, activities
    seed.py               sample data for local dev
frontend/
  src/
    api.ts                 typed fetch client for the backend
    pages/                 ContactList, ContactDetail
    components/            ActivityForm, Timeline
```

## Running locally

### Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
python -m app.seed            # creates crm.db and loads sample data
uvicorn app.main:app --reload --port 8000
```

API docs at `http://127.0.0.1:8000/docs`.

By default the backend uses SQLite (`crm.db`, gitignored). To point at
Postgres instead, copy `.env.example` to `.env` and set `DATABASE_URL`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App at `http://localhost:5173`. It talks to the backend directly at
`http://127.0.0.1:8000` — make sure that's running.

## API surface

| Method | Path                              | Purpose                                   |
|--------|-----------------------------------|--------------------------------------------|
| GET    | `/contacts?q=&type=&limit=&offset=` | search / browse contacts                |
| GET    | `/contacts/{id}`                  | contact + organization + activity timeline |
| POST   | `/contacts`                       | create a contact                          |
| GET    | `/organizations`                  | list organizations                        |
| POST   | `/organizations`                  | create an organization                    |
| GET    | `/organizations/{id}`             | organization + its contacts               |
| GET    | `/medicines?q=`                   | medicine autocomplete                     |
| POST   | `/medicines`                      | add a medicine                            |
| POST   | `/contacts/{id}/activities`       | log an activity against a contact         |
| GET    | `/follow-ups?due_before=`         | activities with an open follow-up date    |

## Roadmap

- **Phase 2:** rep accounts + auth; activities attribute to the logged-in rep
  (`activities.rep_id` already exists on the schema for this).
- **Phase 3:** follow-up dashboard / reminders, built on `GET /follow-ups`.
- **Phase 4:** reporting (activity volume per medicine / org type), medicine
  catalog admin.
