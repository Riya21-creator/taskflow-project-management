import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchData = async () => {
    const projectRes = await API.get(`/projects/${id}`);
    const taskRes = await API.get(`/tasks/project/${id}`);

    setProject(projectRes.data);
    setTasks(taskRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const deleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    await API.delete(`/projects/${id}`);
    toast.success("Project deleted");
    navigate("/projects");
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    await API.delete(`/tasks/${taskId}`);
    toast.success("Task deleted");
    fetchData();
  };

  if (!project) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>

        {user?.role === "Admin" && (
          <button className="danger-btn" onClick={deleteProject}>
            <Trash2 size={18} /> Delete Project
          </button>
        )}
      </div>

      <div className="section">
        <h2>Team Members</h2>

        <div className="member-list">
          {project.members?.map((member) => (
            <span className="member-chip" key={member._id}>
              {member.name}
            </span>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Project Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks added yet.</p>
        ) : (
          <div className="list">
            {tasks.map((task) => (
              <div className="item task-card" key={task._id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Assigned To: {task.assignedTo?.name}</p>
                  <p>Due Date: {task.dueDate?.slice(0, 10)}</p>

                  <span className={`badge ${task.status.replaceAll(" ", "-").toLowerCase()}`}>
                    {task.status}
                  </span>

                  <span className={`badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>

                {user?.role === "Admin" && (
                  <button className="icon-btn" onClick={() => deleteTask(task._id)}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;