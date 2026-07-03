from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import Base, engine
from .routers import activities, contacts, medicines, organizations

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pharma CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(organizations.router)
app.include_router(contacts.router)
app.include_router(medicines.router)
app.include_router(activities.router)


@app.get("/health")
def health():
    return {"status": "ok"}
