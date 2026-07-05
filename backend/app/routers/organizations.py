from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.get("", response_model=list[schemas.OrganizationOut])
def list_organizations(
    city: Optional[str] = None,
    type: Optional[models.OrganizationType] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return crud.list_organizations(db, city=city, org_type=type, limit=limit, offset=offset)


@router.get("/cities", response_model=list[str])
def list_cities(db: Session = Depends(get_db)):
    return crud.list_cities(db)


@router.post("", response_model=schemas.OrganizationOut, status_code=201)
def create_organization(org: schemas.OrganizationCreate, db: Session = Depends(get_db)):
    return crud.create_organization(db, org)


@router.get("/{org_id}", response_model=schemas.OrganizationWithContacts)
def get_organization(org_id: int, db: Session = Depends(get_db)):
    org = crud.get_organization(db, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org
