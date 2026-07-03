import type { Activity } from "../api";

export default function Timeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return <p>No activities logged yet.</p>;
  }

  return (
    <ul className="timeline">
      {activities.map((a) => (
        <li key={a.id}>
          <div className="timeline-date">{new Date(a.created_at).toLocaleString()}</div>
          <div className="timeline-body">
            <p>{a.description}</p>
            {a.medicine && <span className="tag">{a.medicine.name}</span>}
            {a.follow_up_date && (
              <span className="tag follow-up">Follow up: {a.follow_up_date}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
