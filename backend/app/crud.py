from datetime import date
from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from . import models, schemas


# ---------- Organizations ----------
def create_organization(db: Session, org: schemas.OrganizationCreate) -> models.Organization:
    db_org = models.Organization(**org.model_dump())
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    return db_org


def get_organization(db: Session, org_id: int) -> Optional[models.Organization]:
    return (
        db.query(models.Organization)
        .options(joinedload(models.Organization.contacts))
        .filter(models.Organization.id == org_id)
        .first()
    )


def list_organizations(db: Session, limit: int = 50, offset: int = 0):
    return db.query(models.Organization).order_by(models.Organization.name).offset(offset).limit(limit).all()


# ---------- Contacts ----------
def create_contact(db: Session, contact: schemas.ContactCreate) -> models.Contact:
    db_contact = models.Contact(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


def get_contact(db: Session, contact_id: int) -> Optional[models.Contact]:
    return (
        db.query(models.Contact)
        .options(
            joinedload(models.Contact.organization),
            joinedload(models.Contact.activities).joinedload(models.Activity.medicine),
        )
        .filter(models.Contact.id == contact_id)
        .first()
    )


def search_contacts(
    db: Session,
    q: Optional[str] = None,
    org_type: Optional[models.OrganizationType] = None,
    limit: int = 50,
    offset: int = 0,
):
    query = db.query(models.Contact).options(joinedload(models.Contact.organization)).join(
        models.Organization
    )

    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(models.Contact.name.ilike(like), models.Organization.name.ilike(like))
        )

    if org_type:
        query = query.filter(models.Organization.type == org_type)

    return query.order_by(models.Contact.name).offset(offset).limit(limit).all()


# ---------- Medicines ----------
def create_medicine(db: Session, medicine: schemas.MedicineCreate) -> models.Medicine:
    db_medicine = models.Medicine(**medicine.model_dump())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine


def search_medicines(db: Session, q: Optional[str] = None, limit: int = 20):
    query = db.query(models.Medicine)
    if q:
        query = query.filter(models.Medicine.name.ilike(f"%{q}%"))
    return query.order_by(models.Medicine.name).limit(limit).all()


# ---------- Activities ----------
def create_activity(db: Session, contact_id: int, activity: schemas.ActivityCreate) -> models.Activity:
    db_activity = models.Activity(contact_id=contact_id, **activity.model_dump())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity


def list_open_follow_ups(db: Session, due_before: Optional[date] = None):
    query = (
        db.query(models.Activity)
        .options(joinedload(models.Activity.contact), joinedload(models.Activity.medicine))
        .filter(models.Activity.follow_up_date.isnot(None))
    )
    if due_before:
        query = query.filter(models.Activity.follow_up_date <= due_before)
    return query.order_by(models.Activity.follow_up_date).all()
