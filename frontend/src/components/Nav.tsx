import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" end>
        Contacts
      </NavLink>
      <NavLink to="/organizations">Organizations</NavLink>
      <NavLink to="/medicines">Medicines</NavLink>
      <NavLink to="/follow-ups">Follow-ups</NavLink>
    </nav>
  );
}
