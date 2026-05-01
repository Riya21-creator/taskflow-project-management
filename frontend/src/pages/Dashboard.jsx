import { useEffect, useState } from "react";
import { FolderKanban, ListTodo, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import API from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await API.get("/dashboard");
      setStats(res.data);
    };

    fetchDashboard();
  }, []);

  if (!stats) return <div className="page">Loading...</div>;

  const cards = [
    { title: "Projects", value: stats.totalProjects, icon: <FolderKanban /> },
    { title: "Total Tasks", value: stats.totalTasks, icon: <ListTodo /> },
    { title: "Todo", value: stats.todoTasks, icon: <Clock /> },
    { title: "In Progress", value: stats.inProgressTasks, icon: <ListTodo /> },
    { title: "Completed", value: stats.completedTasks, icon: <CheckCircle /> },
    { title: "Overdue", value: stats.overdueTasks, icon: <AlertTriangle /> }
  ];

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="muted">Track project and task progress in one place.</p>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div className="dashboard-card" key={card.title}>
            <div className="dashboard-icon">{card.icon}</div>
            <div>
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;