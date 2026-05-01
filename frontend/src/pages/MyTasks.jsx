import { useEffect, useState } from "react";
import API from "../services/api";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
  fetchTasks();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  return (
    <div className="page">
      <h1>My Tasks</h1>

      <div className="list">
        {tasks.map((task) => (
          <div className="item" key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Project: {task.project?.title}</p>
            <p>Assigned To: {task.assignedTo?.name}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {task.dueDate?.slice(0, 10)}</p>

            <select
              value={task.status}
              onChange={(e) => updateStatus(task._id, e.target.value)}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;