from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from .models import OrganizationType


# ---------- Medicine ----------
class MedicineBase(BaseModel):
    name: str
    manufacturer: Optional[str] = None


class MedicineCreate(MedicineBase):
    pass


class MedicineOut(MedicineBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Organization ----------
class OrganizationBase(BaseModel):
    name: str
    type: OrganizationType
    address: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationOut(OrganizationBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class OrganizationWithContacts(OrganizationOut):
    contacts: list["ContactOut"] = []


# ---------- Activity ----------
class ActivityBase(BaseModel):
    description: str
    medicine_id: Optional[int] = None
    follow_up_date: Optional[date] = None


class ActivityCreate(ActivityBase):
    pass


class ActivityOut(ActivityBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    contact_id: int
    created_at: datetime
    medicine: Optional[MedicineOut] = None


class ActivityWithContact(ActivityOut):
    contact: "ContactOut"


# ---------- Contact ----------
class ContactBase(BaseModel):
    name: str
    role: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    organization_id: int


class ContactCreate(ContactBase):
    pass


class ContactOut(ContactBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class ContactListItem(ContactOut):
    organization: OrganizationOut


class ContactDetail(ContactOut):
    organization: OrganizationOut
    activities: list[ActivityOut] = []


OrganizationWithContacts.model_rebuild()
ActivityWithContact.model_rebuild()
