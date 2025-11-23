import { Link } from "react-router-dom";
import "./AppHeader.css";

export default function AppHeader() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          Tiny<span>Link</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-item">Dashboard</Link>
          <Link to="/health" className="nav-item">Health</Link>
        </nav>
      </div>
    </header>
  );
}
