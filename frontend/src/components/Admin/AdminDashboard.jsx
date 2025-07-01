import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import API from '../../api';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await API.put(`/admin/user/${id}/toggle`);
      fetchUsers();
      toast.success('User status updated');
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const deactivatedUsers = totalUsers - activeUsers;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">👑 Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="row mb-5 text-center">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Users</h5>
              <p className="display-6">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-success">
            <div className="card-body">
              <h5 className="card-title text-success">Active Users</h5>
              <p className="display-6">{activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-danger">
            <div className="card-body">
              <h5 className="card-title text-danger">Deactivated Users</h5>
              <p className="display-6">{deactivatedUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center shadow-sm">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Completed</th>
              <th>Pending</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-muted">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user._id}>
                  <td>{idx + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="text-success fw-bold">{user.completedTasks}</td>
                  <td className="text-warning fw-bold">{user.pendingTasks}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.isActive ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${
                        user.isActive ? 'btn-danger' : 'btn-success'
                      }`}
                      onClick={() => toggleStatus(user._id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
