import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createOrganization,
  listCities,
  listOrganizations,
  type Organization,
  type OrganizationType,
} from "../api";

const TYPE_LABELS: Record<OrganizationType, string> = {
  hospital: "Hospital",
  retail_store: "Retail Store",
  private_doctor: "Private Doctor",
};

export default function OrganizationList() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cityFilter, setCityFilter] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [type, setType] = useState<OrganizationType>("hospital");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    listCities().then(setCities).catch(() => {});
  }, []);

  function load() {
    setLoading(true);
    listOrganizations(50, 0, cityFilter || undefined)
      .then(setOrgs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [cityFilter]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const org = await createOrganization({
        name,
        type,
        address: address || null,
        city: city || null,
        phone: phone || null,
      });
      setOrgs((prev) => [org, ...prev]);
      setName("");
      setAddress("");
      setCity("");
      setPhone("");
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>Organizations</h1>

      <form className="inline-form" onSubmit={handleSubmit}>
        <h3>Add Organization</h3>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value as OrganizationType)}>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {formError && <p className="error">{formError}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Organization"}
        </button>
      </form>

      <div className="filters">
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
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
        {orgs.map((o) => (
          <li key={o.id}>
            <Link to={`/organizations/${o.id}`}>
              <strong>{o.name}</strong>
              <span className="org-tag">
                {TYPE_LABELS[o.type]}
                {o.city ? ` — ${o.city}` : ""}
              </span>
            </Link>
          </li>
        ))}
        {!loading && orgs.length === 0 && <p>No organizations yet.</p>}
      </ul>
    </div>
  );
}
