import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCities, searchContacts, type ContactListItem, type OrganizationType } from "../api";

const TYPE_LABELS: Record<OrganizationType, string> = {
  hospital: "Hospital",
  retail_store: "Retail Store",
  private_doctor: "Private Doctor",
};

export default function ContactList() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<OrganizationType | "">("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [contacts, setContacts] = useState<ContactListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchContacts(query, type || undefined, city || undefined)
      .then(setContacts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query, type, city]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Contacts</h1>
        <Link to="/contacts/new" className="button-link">
          + Add Contact
        </Link>
      </div>
      <div className="filters">
        <input
          placeholder="Search by contact or organization name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value as OrganizationType | "")}>
          <option value="">All types</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="contact-list">
        {contacts.map((c) => (
          <li key={c.id}>
            <Link to={`/contacts/${c.id}`}>
              <strong>{c.name}</strong> — {c.role || "No role"}
              <span className="org-tag">
                {c.organization.name} ({TYPE_LABELS[c.organization.type]})
              </span>
            </Link>
          </li>
        ))}
        {!loading && contacts.length === 0 && <p>No contacts found.</p>}
      </ul>
    </div>
  );
}
