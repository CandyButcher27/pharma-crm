from datetime import date, timedelta

from .database import Base, SessionLocal, engine
from .models import Activity, Contact, Medicine, Organization, OrganizationType

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if db.query(Organization).count() > 0:
    print("Already seeded, skipping.")
else:
    hospital = Organization(
        name="City General Hospital",
        type=OrganizationType.hospital,
        address="12 MG Road",
        city="Pune",
        phone="020-1234567",
    )
    retail = Organization(
        name="Apollo Pharmacy - FC Road",
        type=OrganizationType.retail_store,
        address="45 FC Road",
        city="Pune",
        phone="020-7654321",
    )
    doctor_org = Organization(
        name="Dr. Mehta Clinic",
        type=OrganizationType.private_doctor,
        address="8 Baner Road",
        city="Pune",
        phone="020-9988776",
    )
    db.add_all([hospital, retail, doctor_org])
    db.flush()

    contacts = [
        Contact(name="Dr. Anjali Rao", role="Chief Pharmacist", phone="9876500001",
                email="anjali.rao@citygeneral.com", organization_id=hospital.id),
        Contact(name="Suresh Nair", role="Purchasing Head", phone="9876500002",
                email="suresh.nair@citygeneral.com", organization_id=hospital.id),
        Contact(name="Priya Sharma", role="Store Manager", phone="9876500003",
                email="priya.sharma@apollo.com", organization_id=retail.id),
        Contact(name="Dr. Vikram Mehta", role="Private Practitioner", phone="9876500004",
                email="vikram.mehta@mehtaclinic.com", organization_id=doctor_org.id),
    ]
    db.add_all(contacts)
    db.flush()

    medicines = [
        Medicine(name="Paracetamol 500mg", manufacturer="Cipla"),
        Medicine(name="Azithromycin 250mg", manufacturer="Sun Pharma"),
        Medicine(name="Amoxicillin 500mg", manufacturer="GSK"),
        Medicine(name="Metformin 500mg", manufacturer="USV"),
        Medicine(name="Atorvastatin 10mg", manufacturer="Dr. Reddy's"),
        Medicine(name="Pantoprazole 40mg", manufacturer="Alkem"),
        Medicine(name="Cetirizine 10mg", manufacturer="Cipla"),
        Medicine(name="Losartan 50mg", manufacturer="Torrent"),
        Medicine(name="Insulin Glargine", manufacturer="Sanofi"),
        Medicine(name="Vitamin D3 60000IU", manufacturer="Mankind"),
    ]
    db.add_all(medicines)
    db.flush()

    today = date.today()
    activities = [
        Activity(
            contact_id=contacts[0].id,
            description="Introduced new Azithromycin formulation, positive feedback.",
            medicine_id=medicines[1].id,
            follow_up_date=today + timedelta(days=7),
        ),
        Activity(
            contact_id=contacts[0].id,
            description="Follow-up call, discussed bulk pricing.",
            follow_up_date=None,
        ),
        Activity(
            contact_id=contacts[2].id,
            description="Restocked Paracetamol and Cetirizine, checked shelf placement.",
            medicine_id=medicines[0].id,
            follow_up_date=today + timedelta(days=14),
        ),
        Activity(
            contact_id=contacts[3].id,
            description="Discussed Atorvastatin dosing for elderly patients.",
            medicine_id=medicines[4].id,
            follow_up_date=today + timedelta(days=3),
        ),
    ]
    db.add_all(activities)
    db.commit()
    print("Seed complete.")

db.close()
