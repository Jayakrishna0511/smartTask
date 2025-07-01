import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import API from '../../api';
import { toast } from 'react-toastify';

function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Input change handler
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add or update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, form);
        toast.success('Task updated successfully');
      } else {
        await API.post('/tasks', form);
        toast.success('Task added successfully');
      }
      setForm({ title: '', description: '' });
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  // Toggle complete
  const handleComplete = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        ...task,
        isCompleted: !task.isCompleted,
      });
      toast.success(
        task.isCompleted ? 'Marked as pending' : 'Marked as completed'
      );
      fetchTasks();
    } catch {
      toast.error('Failed to update task status');
    }
  };

  // Edit task
  const handleEdit = (task) => {
    setForm({ title: task.title, description: task.description });
    setEditingId(task._id);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">User Dashboard</h2>

      {/* Task Form */}
      <div className="card p-4 mb-5 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="form-control"
                placeholder="Task title"
                required
              />
            </div>
            <div className="col-md-5">
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Description"
              />
            </div>
            <div className="col-md-3 d-grid">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Task List */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Your Tasks</h5>
          {tasks.length === 0 ? (
            <p className="text-muted">No tasks yet.</p>
          ) : (
            <ul className="list-group">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="flex-grow-1">
                    <strong
                      className={
                        task.isCompleted
                          ? 'text-decoration-line-through text-muted'
                          : ''
                      }
                    >
                      {task.title}
                    </strong>
                    <div className="text-muted small">{task.description}</div>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button
                      className={`btn btn-${task.isCompleted ? 'warning' : 'success'}`}
                      onClick={() => handleComplete(task)}
                    >
                      {task.isCompleted ? 'Undo' : 'Complete'}
                    </button>
                    <button
                      className="btn btn-info text-white"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
