from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.get("", response_model=list[schemas.ContactListItem])
def search_contacts(
    q: Optional[str] = None,
    type: Optional[models.OrganizationType] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return crud.search_contacts(db, q=q, org_type=type, limit=limit, offset=offset)


@router.post("", response_model=schemas.ContactOut, status_code=201)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    org = crud.get_organization(db, contact.organization_id)
    if not org:
        raise HTTPException(status_code=400, detail="Organization not found")
    return crud.create_contact(db, contact)


@router.get("/{contact_id}", response_model=schemas.ContactDetail)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = crud.get_contact(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.post("/{contact_id}/activities", response_model=schemas.ActivityOut, status_code=201)
def add_activity(contact_id: int, activity: schemas.ActivityCreate, db: Session = Depends(get_db)):
    contact = crud.get_contact(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    if activity.medicine_id is not None:
        medicine = db.get(models.Medicine, activity.medicine_id)
        if not medicine:
            raise HTTPException(status_code=400, detail="Medicine not found")
    return crud.create_activity(db, contact_id, activity)
