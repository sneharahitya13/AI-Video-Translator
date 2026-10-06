function Navbar({ onHome, onLogout }) {
  return (
    <nav className="navbar">

      <div
        className="navbar-logo"
        onClick={onHome}
      >
        SpeakLocal
      </div>

      <div className="navbar-links">

        <button
          className="nav-button"
          onClick={onHome}
        >
          Home
        </button>

        <button
          className="nav-button logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;