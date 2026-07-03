import { useEffect, useState } from "react";
import { addActivity, searchMedicines, type Activity, type Medicine } from "../api";

export default function ActivityForm({
  contactId,
  onAdded,
}: {
  contactId: number;
  onAdded: (activity: Activity) => void;
}) {
  const [description, setDescription] = useState("");
  const [medicineQuery, setMedicineQuery] = useState("");
  const [medicineOptions, setMedicineOptions] = useState<Medicine[]>([]);
  const [medicineId, setMedicineId] = useState<number | null>(null);
  const [followUpDate, setFollowUpDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!medicineQuery) {
      setMedicineOptions([]);
      return;
    }
    searchMedicines(medicineQuery).then(setMedicineOptions).catch(() => {});
  }, [medicineQuery]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const activity = await addActivity(contactId, {
        description,
        medicine_id: medicineId,
        follow_up_date: followUpDate || null,
      });
      onAdded(activity);
      setDescription("");
      setMedicineQuery("");
      setMedicineOptions([]);
      setMedicineId(null);
      setFollowUpDate("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <h3>Add Activity</h3>
      <textarea
        placeholder="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <div className="medicine-picker">
        <input
          placeholder="Medicine (optional)"
          value={medicineId ? medicineOptions.find((m) => m.id === medicineId)?.name ?? medicineQuery : medicineQuery}
          onChange={(e) => {
            setMedicineQuery(e.target.value);
            setMedicineId(null);
          }}
        />
        {medicineQuery && !medicineId && medicineOptions.length > 0 && (
          <ul className="medicine-options">
            {medicineOptions.map((m) => (
              <li
                key={m.id}
                onClick={() => {
                  setMedicineId(m.id);
                  setMedicineQuery(m.name);
                  setMedicineOptions([]);
                }}
              >
                {m.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <label>
        Follow-up date
        <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Activity"}
      </button>
    </form>
  );
}
