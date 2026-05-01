import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    await API.delete(`/projects/${id}`);
    toast.success("Project deleted");
    fetchProjects();
  };

  return (
    <div className="page">
      <h1>Projects</h1>

      <div className="project-grid">
        {projects.map((project) => (
          <div className="project-card" key={project._id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <div className="project-meta">
              <span>{project.members?.length || 0} Members</span>
              <span>{project.createdBy?.name}</span>
            </div>

            <div className="card-actions">
              <Link to={`/projects/${project._id}`}>View Details</Link>

              {user?.role === "Admin" && (
                <button onClick={() => deleteProject(project._id)}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;