from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/medicines", tags=["medicines"])


@router.get("", response_model=list[schemas.MedicineOut])
def search_medicines(q: Optional[str] = None, limit: int = 20, db: Session = Depends(get_db)):
    return crud.search_medicines(db, q=q, limit=limit)


@router.post("", response_model=schemas.MedicineOut, status_code=201)
def create_medicine(medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    return crud.create_medicine(db, medicine)
