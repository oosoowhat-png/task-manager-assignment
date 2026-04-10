import { useEffect, useState } from "react";
import API from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title) => {
    try {
      const res = await API.post("/tasks", { title });
      setTasks([...tasks, res.data]);
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await API.patch(`/tasks/${id}`);
      setTasks(tasks.map((task) => (task.id === id ? res.data : task)));
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <TaskForm onAdd={addTask} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && (
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}

export default App;