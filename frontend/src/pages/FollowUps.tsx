import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listFollowUps, type ActivityWithContact } from "../api";

export default function FollowUps() {
  const [dueBefore, setDueBefore] = useState("");
  const [followUps, setFollowUps] = useState<ActivityWithContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listFollowUps(dueBefore || undefined)
      .then(setFollowUps)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [dueBefore]);

  return (
    <div className="page">
      <h1>Follow-ups</h1>
      <label className="filter-label">
        Due before
        <input type="date" value={dueBefore} onChange={(e) => setDueBefore(e.target.value)} />
      </label>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="timeline">
        {followUps.map((a) => (
          <li key={a.id}>
            <div className="timeline-date">Due {a.follow_up_date}</div>
            <div className="timeline-body">
              <p>{a.description}</p>
              {a.medicine && <span className="tag">{a.medicine.name}</span>}
              <Link to={`/contacts/${a.contact_id}`} className="tag follow-up">
                {a.contact.name}
              </Link>
            </div>
          </li>
        ))}
        {!loading && followUps.length === 0 && <p>No open follow-ups.</p>}
      </ul>
    </div>
  );
}
