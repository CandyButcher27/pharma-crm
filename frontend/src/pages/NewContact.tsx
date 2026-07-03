import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createContact, listOrganizations, type Organization } from "../api";

export default function NewContact() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [organizationId, setOrganizationId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listOrganizations().then(setOrgs).catch((e) => setError(e.message));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !organizationId) return;
    setSubmitting(true);
    setError(null);
    try {
      const contact = await createContact({
        name,
        role: role || null,
        phone: phone || null,
        email: email || null,
        organization_id: organizationId,
      });
      navigate(`/contacts/${contact.id}`);
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Link to="/">&larr; Back to contacts</Link>
      <h1>Add Contact</h1>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <select
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value ? Number(e.target.value) : "")}
          required
        >
          <option value="">Select organization...</option>
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Contact"}
        </button>
      </form>
    </div>
  );
}
