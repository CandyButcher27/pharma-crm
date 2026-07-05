import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Nav() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <span className="brand">Pharma CRM</span>
        <div className="nav-links">
          <NavLink to="/" end>
            Contacts
          </NavLink>
          <NavLink to="/organizations">Organizations</NavLink>
          <NavLink to="/medicines">Medicines</NavLink>
          <NavLink to="/follow-ups">Follow-ups</NavLink>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </button>
      </div>
    </nav>
  );
}
