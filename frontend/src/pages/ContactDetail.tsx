import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getContact, type ContactDetail as ContactDetailType } from "../api";
import Timeline from "../components/Timeline";
import ActivityForm from "../components/ActivityForm";

const TYPE_LABELS: Record<string, string> = {
  hospital: "Hospital",
  retail_store: "Retail Store",
  private_doctor: "Private Doctor",
};

export default function ContactDetail() {
  const { id } = useParams();
  const [contact, setContact] = useState<ContactDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getContact(Number(id)).then(setContact).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!contact) return <p>Loading...</p>;

  return (
    <div className="page">
      <Link to="/">&larr; Back to contacts</Link>
      <h1>{contact.name}</h1>
      <p className="subtitle">{contact.role || "No role"}</p>
      <div className="org-panel">
        <h2>{contact.organization.name}</h2>
        <p>{TYPE_LABELS[contact.organization.type]}</p>
        {contact.organization.address && <p>{contact.organization.address}, {contact.organization.city}</p>}
        {contact.organization.phone && <p>{contact.organization.phone}</p>}
      </div>

      <ActivityForm
        contactId={contact.id}
        onAdded={(activity) =>
          setContact((prev) => (prev ? { ...prev, activities: [activity, ...prev.activities] } : prev))
        }
      />

      <h2>Activity Timeline</h2>
      <Timeline activities={contact.activities} />
    </div>
  );
}
