import { useEffect, useState } from "react";
import { createMedicine, searchMedicines, type Medicine } from "../api";

export default function MedicineList() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    searchMedicines(query)
      .then(setMedicines)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const medicine = await createMedicine({ name, manufacturer: manufacturer || null });
      setMedicines((prev) => [medicine, ...prev]);
      setName("");
      setManufacturer("");
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>Medicines</h1>

      <form className="inline-form" onSubmit={handleSubmit}>
        <h3>Add Medicine</h3>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input
          placeholder="Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />
        {formError && <p className="error">{formError}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Medicine"}
        </button>
      </form>

      <input
        placeholder="Search medicines..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="contact-list">
        {medicines.map((m) => (
          <li key={m.id}>
            <div className="static-row">
              <strong>{m.name}</strong>
              {m.manufacturer && <span className="org-tag">{m.manufacturer}</span>}
            </div>
          </li>
        ))}
        {!loading && medicines.length === 0 && <p>No medicines found.</p>}
      </ul>
    </div>
  );
}
