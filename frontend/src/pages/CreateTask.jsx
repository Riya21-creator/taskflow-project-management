import { useEffect, useState } from "react";
import API from "../services/api";

const CreateTask = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    status: "Todo",
    priority: "Medium",
    dueDate: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const projectRes = await API.get("/projects");
      const userRes = await API.get("/projects/users");

      setProjects(projectRes.data);
      setUsers(userRes.data);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/tasks", form);

    setMessage("Task created successfully");

    setForm({
      title: "",
      description: "",
      project: "",
      assignedTo: "",
      status: "Todo",
      priority: "Medium",
      dueDate: ""
    });
  };

  return (
    <div className="page">
      <h1>Create Task</h1>

      {message && <p className="success">{message}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Task description"
          value={form.description}
          onChange={handleChange}
        />

        <select name="project" value={form.project} onChange={handleChange}>
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option value={project._id} key={project._id}>
              {project.title}
            </option>
          ))}
        </select>

        <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
          <option value="">Assign To</option>
          {users.map((user) => (
            <option value={user._id} key={user._id}>
              {user.name} - {user.email}
            </option>
          ))}
        </select>

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <button>Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;