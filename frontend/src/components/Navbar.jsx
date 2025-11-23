import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="nav-container">
      <Link to="/" className="brand">
        TinyLink<span>.io</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/healthz">Health</NavLink>
      </div>

      <Link to="/dashboard" className="btn-create">
        + Create Link
      </Link>
    </nav>
  );
}
