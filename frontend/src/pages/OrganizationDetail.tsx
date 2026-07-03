import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createContact, getOrganization, type OrganizationWithContacts } from "../api";

const TYPE_LABELS: Record<string, string> = {
  hospital: "Hospital",
  retail_store: "Retail Store",
  private_doctor: "Private Doctor",
};

export default function OrganizationDetail() {
  const { id } = useParams();
  const [org, setOrg] = useState<OrganizationWithContacts | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getOrganization(Number(id)).then(setOrg).catch((e) => setError(e.message));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !org) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const contact = await createContact({
        name,
        role: role || null,
        phone: phone || null,
        email: email || null,
        organization_id: org.id,
      });
      setOrg((prev) => (prev ? { ...prev, contacts: [contact, ...prev.contacts] } : prev));
      setName("");
      setRole("");
      setPhone("");
      setEmail("");
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (error) return <p className="error">{error}</p>;
  if (!org) return <p>Loading...</p>;

  return (
    <div className="page">
      <Link to="/organizations">&larr; Back to organizations</Link>
      <h1>{org.name}</h1>
      <p className="subtitle">{TYPE_LABELS[org.type]}</p>
      {org.address && <p>{org.address}, {org.city}</p>}
      {org.phone && <p>{org.phone}</p>}

      <form className="inline-form" onSubmit={handleSubmit}>
        <h3>Add Contact</h3>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {formError && <p className="error">{formError}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Contact"}
        </button>
      </form>

      <h2>Contacts</h2>
      <ul className="contact-list">
        {org.contacts.map((c) => (
          <li key={c.id}>
            <Link to={`/contacts/${c.id}`}>
              <strong>{c.name}</strong> — {c.role || "No role"}
            </Link>
          </li>
        ))}
        {org.contacts.length === 0 && <p>No contacts yet.</p>}
      </ul>
    </div>
  );
}
