import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listFollowUps, type ActivityWithContact } from "../api";

type Bucket = "overdue" | "today" | "week" | "upcoming";

const BUCKET_LABELS: Record<Bucket, string> = {
  overdue: "Overdue",
  today: "Due today",
  week: "Due this week",
  upcoming: "Upcoming",
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

function bucketFor(dateStr: string): Bucket {
  const diff = daysUntil(dateStr);
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff <= 7) return "week";
  return "upcoming";
}

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

  const grouped = useMemo(() => {
    const groups: Record<Bucket, ActivityWithContact[]> = {
      overdue: [],
      today: [],
      week: [],
      upcoming: [],
    };
    for (const a of followUps) {
      if (!a.follow_up_date) continue;
      groups[bucketFor(a.follow_up_date)].push(a);
    }
    return groups;
  }, [followUps]);

  return (
    <div className="page">
      <h1>Follow-up Dashboard</h1>
      <p className="subtitle">Every open follow-up across your territory, grouped by urgency.</p>

      <div className="stat-grid">
        <div className="stat-card overdue">
          <div className="stat-value">{grouped.overdue.length}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-card today">
          <div className="stat-value">{grouped.today.length}</div>
          <div className="stat-label">Due today</div>
        </div>
        <div className="stat-card week">
          <div className="stat-value">{grouped.week.length}</div>
          <div className="stat-label">Due this week</div>
        </div>
        <div className="stat-card upcoming">
          <div className="stat-value">{grouped.upcoming.length}</div>
          <div className="stat-label">Upcoming</div>
        </div>
      </div>

      <label className="filter-label">
        Due before
        <input type="date" value={dueBefore} onChange={(e) => setDueBefore(e.target.value)} />
      </label>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading &&
        followUps.length > 0 &&
        (["overdue", "today", "week", "upcoming"] as Bucket[]).map((bucket) =>
          grouped[bucket].length === 0 ? null : (
            <div className="followup-group" key={bucket}>
              <h2>
                {BUCKET_LABELS[bucket]} ({grouped[bucket].length})
              </h2>
              {grouped[bucket].map((a) => (
                <div className={`followup-card ${bucket}`} key={a.id}>
                  <div className="followup-body">
                    <p>{a.description}</p>
                    {a.medicine && <span className="tag">{a.medicine.name}</span>}
                    <Link to={`/contacts/${a.contact_id}`} className="tag follow-up">
                      {a.contact.name}
                    </Link>
                  </div>
                  <span className={`followup-due ${bucket}`}>{a.follow_up_date}</span>
                </div>
              ))}
            </div>
          )
        )}

      {!loading && followUps.length === 0 && <p>No open follow-ups.</p>}
    </div>
  );
}
