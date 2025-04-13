import { useState, useEffect } from "react";
import axios from "axios";
import "./TaskManager.css";
import { Icon } from "@iconify/react";
const API_URL = 'https://proyecto-final-tjsm.onrender.com/api';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');


  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Tareas recibidas:", response.data); // Log para depurar
      setTasks(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar tareas");
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingTask) {
        const response = await axios.put(
          `${API_URL}/tasks/${editingTask.id}`,
          { title, description, state: editingTask.state },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess(response.data.message);
        setEditingTask(null);
      } else {
        const response = await axios.post(
          `${API_URL}/tasks`,
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess(response.data.message);
      }
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar tarea");
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    console.log(task);
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${task.id}`,
        { title: task.title, description: task.description, state: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(
        `Tarea actualizada a "${
          newStatus === "pendiente"
            ? "Pendiente"
            : newStatus === "en_progreso"
            ? "En proceso"
            : "Completado"
        }"`
      );
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar estado");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta tarea?")) {
      try {
        await axios.delete(`${API_URL}/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Tarea eliminada con éxito");
        fetchTasks();
      } catch (err) {
        setError(err.response?.data?.error || "Error al eliminar tarea");
      }
    }
  };

  // Mapear estad a etiquetas para mostrar
  const statusLabels = {
    pendiente: "Pendiente",
    en_progreso: "En proceso",
    completado: "Completado",
  };

  // Filtrar tareas según filterStatus
  const filteredTasks = filterStatus === 'all'
    ? tasks
    : tasks.filter(task => task.state === filterStatus);

  return (
    <div className="container">
      <div className="task-manager">
        <h2>Administrador de Tareas</h2>

        {success && <p className="success">{success}</p>}

        {/* Formulario para crear o editar tareas */}
        <form onSubmit={handleCreateOrUpdate}>
          <div className="form">
            <div className="form-group">
              <label>Título:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit">
            {editingTask ? "Actualizar Tarea" : "Crear Tarea"}
          </button>
        </form>
      </div>

      {/* listado detareas */}

      <div>
        <h3>Tareas</h3>
        <div className="filter-group">
        <label>Filtrar por estado:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En proceso</option>
          <option value="completado">Completada</option>
        </select>
      </div>
        {error && <p className="error">{error}</p>}
        {tasks.length === 0 ? (
          <p>No tienes tareas aún.</p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.state || "pendiente"}`}
              >
                <div className="task-content">
                  <div>
                    <strong>{task.title}</strong>
                    {task.description && <p>{task.description}</p>}
                  </div>
                </div>
                <div>
                  <select className="select"
                    value={task.state || "pendiente"}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En progreso</option>
                    <option value="completado">Completada</option>
                  </select>
                </div>
                <div className="task-actions">
                  <button onClick={() => handleEdit(task)}>
                    <Icon icon="mdi:edit" className="icono" />
                  </button>
                  <button onClick={() => handleDelete(task.id)}>
                    <Icon icon="mdi:delete" className="icono" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
