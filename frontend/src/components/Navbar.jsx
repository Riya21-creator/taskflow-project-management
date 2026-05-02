import { Link } from "react-router-dom";
import "../index.css";

const Navbar = ({ user, logoutUser }) => {
  return (
    <nav className="navbar">
      <h2 className="logo">TaskFlow</h2>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/my-tasks">My Tasks</Link>

        {user?.role === "Admin" && (
          <>
            <Link to="/create-project">Create Project</Link>
            <Link to="/create-task">Create Task</Link>
          </>
        )}

        <span className="role">{user?.role}</span>

        <button onClick={logoutUser}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;