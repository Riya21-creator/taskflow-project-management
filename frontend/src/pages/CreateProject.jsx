import { useEffect, useState } from "react";
import API from "../services/api";

const CreateProject = () => {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    members: []
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await API.get("/projects/users");
      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleMemberChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    setForm({
      ...form,
      members: selected
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/projects", form);

    setMessage("Project created successfully");

    setForm({
      title: "",
      description: "",
      members: []
    });
  };

  return (
    <div className="page">
      <h1>Create Project</h1>

      {message && <p className="success">{message}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Project title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Project description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Select Team Members</label>
        <select multiple value={form.members} onChange={handleMemberChange}>
          {users.map((user) => (
            <option value={user._id} key={user._id}>
              {user.name} - {user.email}
            </option>
          ))}
        </select>

        <button>Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;