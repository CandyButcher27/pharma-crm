from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/follow-ups", tags=["activities"])


@router.get("", response_model=list[schemas.ActivityWithContact])
def list_follow_ups(due_before: Optional[date] = None, db: Session = Depends(get_db)):
    return crud.list_open_follow_ups(db, due_before=due_before)
