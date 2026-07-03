from datetime import date, timedelta

from .database import Base, SessionLocal, engine
from .models import Activity, Contact, Medicine, Organization, OrganizationType

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if db.query(Organization).count() > 0:
    print("Already seeded, skipping.")
else:
    organizations = [
        Organization(name="City General Hospital", type=OrganizationType.hospital,
                     address="12 MG Road", city="Pune", phone="020-1234567"),
        Organization(name="Ruby Hall Clinic", type=OrganizationType.hospital,
                     address="40 Sassoon Road", city="Pune", phone="020-2233445"),
        Organization(name="Sunrise Multispeciality Hospital", type=OrganizationType.hospital,
                     address="9 Airport Road", city="Nagpur", phone="0712-2244668"),
        Organization(name="Apollo Pharmacy - FC Road", type=OrganizationType.retail_store,
                     address="45 FC Road", city="Pune", phone="020-7654321"),
        Organization(name="MedPlus - Koregaon Park", type=OrganizationType.retail_store,
                     address="21 North Main Road", city="Pune", phone="020-6677889"),
        Organization(name="Wellness Forever - Viman Nagar", type=OrganizationType.retail_store,
                     address="3 Airport Road", city="Pune", phone="020-3344556"),
        Organization(name="Dr. Mehta Clinic", type=OrganizationType.private_doctor,
                     address="8 Baner Road", city="Pune", phone="020-9988776"),
        Organization(name="Dr. Kulkarni Family Practice", type=OrganizationType.private_doctor,
                     address="17 Karve Road", city="Pune", phone="020-5566778"),
        Organization(name="Dr. Iyer Diabetes Care", type=OrganizationType.private_doctor,
                     address="5 Camp Road", city="Nagpur", phone="0712-3355779"),
    ]
    db.add_all(organizations)
    db.flush()
    (hospital, hospital2, hospital3, retail, retail2, retail3,
     doctor_org, doctor_org2, doctor_org3) = organizations

    contacts = [
        Contact(name="Dr. Anjali Rao", role="Chief Pharmacist", phone="9876500001",
                email="anjali.rao@citygeneral.com", organization_id=hospital.id),
        Contact(name="Suresh Nair", role="Purchasing Head", phone="9876500002",
                email="suresh.nair@citygeneral.com", organization_id=hospital.id),
        Contact(name="Dr. Kavita Joshi", role="Head of Cardiology", phone="9876500005",
                email="kavita.joshi@rubyhall.com", organization_id=hospital2.id),
        Contact(name="Ramesh Kulkarni", role="Procurement Manager", phone="9876500006",
                email="ramesh.kulkarni@rubyhall.com", organization_id=hospital2.id),
        Contact(name="Dr. Farhan Sheikh", role="Resident Doctor", phone="9876500007",
                email="farhan.sheikh@sunrise.com", organization_id=hospital3.id),
        Contact(name="Priya Sharma", role="Store Manager", phone="9876500003",
                email="priya.sharma@apollo.com", organization_id=retail.id),
        Contact(name="Amit Deshmukh", role="Store Owner", phone="9876500008",
                email="amit.deshmukh@medplus.com", organization_id=retail2.id),
        Contact(name="Neha Kapoor", role="Store Manager", phone="9876500009",
                email="neha.kapoor@wellnessforever.com", organization_id=retail3.id),
        Contact(name="Dr. Vikram Mehta", role="Private Practitioner", phone="9876500004",
                email="vikram.mehta@mehtaclinic.com", organization_id=doctor_org.id),
        Contact(name="Dr. Sanjay Kulkarni", role="Private Practitioner", phone="9876500010",
                email="sanjay.kulkarni@kulkarnifp.com", organization_id=doctor_org2.id),
        Contact(name="Dr. Meera Iyer", role="Diabetologist", phone="9876500011",
                email="meera.iyer@iyerdiabetes.com", organization_id=doctor_org3.id),
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
    (paracetamol, azithromycin, amoxicillin, metformin, atorvastatin,
     pantoprazole, cetirizine, losartan, insulin, vitamin_d) = medicines

    today = date.today()
    activities = [
        Activity(contact_id=contacts[0].id,
                 description="Introduced new Azithromycin formulation, positive feedback.",
                 medicine_id=azithromycin.id, follow_up_date=today + timedelta(days=7)),
        Activity(contact_id=contacts[0].id,
                 description="Follow-up call, discussed bulk pricing.",
                 follow_up_date=None),
        Activity(contact_id=contacts[2].id,
                 description="Discussed Atorvastatin usage in post-cardiac patients.",
                 medicine_id=atorvastatin.id, follow_up_date=today + timedelta(days=5)),
        Activity(contact_id=contacts[3].id,
                 description="Reviewed quarterly order volumes, proposed Losartan bundle.",
                 medicine_id=losartan.id, follow_up_date=today - timedelta(days=2)),
        Activity(contact_id=contacts[4].id,
                 description="Sample drop for Amoxicillin, awaiting trial feedback.",
                 medicine_id=amoxicillin.id, follow_up_date=today + timedelta(days=10)),
        Activity(contact_id=contacts[5].id,
                 description="Restocked Paracetamol and Cetirizine, checked shelf placement.",
                 medicine_id=paracetamol.id, follow_up_date=today + timedelta(days=14)),
        Activity(contact_id=contacts[6].id,
                 description="Onboarded store to new Vitamin D3 SKU.",
                 medicine_id=vitamin_d.id, follow_up_date=today + timedelta(days=21)),
        Activity(contact_id=contacts[7].id,
                 description="Discussed shelf space for Pantoprazole, no follow-up needed.",
                 medicine_id=pantoprazole.id, follow_up_date=None),
        Activity(contact_id=contacts[8].id,
                 description="Discussed Atorvastatin dosing for elderly patients.",
                 medicine_id=atorvastatin.id, follow_up_date=today + timedelta(days=3)),
        Activity(contact_id=contacts[9].id,
                 description="Introduced Metformin extended-release variant.",
                 medicine_id=metformin.id, follow_up_date=today + timedelta(days=6)),
        Activity(contact_id=contacts[10].id,
                 description="Detailed Insulin Glargine dosing schedule for new patients.",
                 medicine_id=insulin.id, follow_up_date=today + timedelta(days=1)),
        Activity(contact_id=contacts[10].id,
                 description="Left samples of Metformin for patient trials.",
                 medicine_id=metformin.id, follow_up_date=today - timedelta(days=1)),
    ]
    db.add_all(activities)
    db.commit()
    print(f"Seed complete: {len(organizations)} organizations, {len(contacts)} contacts, "
          f"{len(medicines)} medicines, {len(activities)} activities.")

db.close()
