import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserList } from '../components/UserList';
import { UserForm } from '../components/UserForm';
import { User, UserFormData } from '../types';
import { Users, Plus, AlertCircle } from 'lucide-react';

export function UserDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      
      // Transform the data to match our schema
      const transformedUsers = data.map((user: any) => ({
        id: user.id,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        department: user.company.name,
      }));
      
      setUsers(transformedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData: UserFormData) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to add user');
      
      // Simulate adding the user locally since JSONPlaceholder doesn't actually create the resource
      const newUser = {
        ...userData,
        id: users.length + 1,
      };
      
      setUsers([...users, newUser]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  const handleEditUser = async (userData: UserFormData) => {
    if (!editingUser) return;
    
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
          'Content-type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to update user');
      
      // Update locally since JSONPlaceholder doesn't actually update the resource
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...userData, id: editingUser.id } : user
      );
      
      setUsers(updatedUsers);
      setEditingUser(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      // Remove locally since JSONPlaceholder doesn't actually delete the resource
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleViewUser = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
          <div className="text-lg text-gray-600">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-10 w-10 text-indigo-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your team members and their account permissions here.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow">
            {showForm ? (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <UserForm
                  onSubmit={editingUser ? handleEditUser : handleAddUser}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                  initialData={editingUser || undefined}
                />
              </div>
            ) : (
              <UserList
                users={currentUsers}
                onEdit={(user) => {
                  setEditingUser(user);
                  setShowForm(true);
                }}
                onDelete={handleDeleteUser}
                onView={handleViewUser}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}