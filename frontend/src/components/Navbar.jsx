import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/signup"];

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">TaskFlow</h2>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/my-tasks">My Tasks</Link>

        {user.role === "Admin" && (
          <>
            <Link to="/create-project">Create Project</Link>
            <Link to="/create-task">Create Task</Link>
          </>
        )}

        <span className="role">{user.role}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;