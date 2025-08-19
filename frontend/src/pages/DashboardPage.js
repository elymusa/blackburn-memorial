import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import PersonForm from '../components/PersonForm';
import './DashboardPage.css';

const DashboardPage = () => {
  const [people, setPeople] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fetchPeople = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const res = await axios.get('http://localhost:5001/api/people');
      // *** THIS IS THE FIX for sorting ***
      const sortedData = res.data.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      );
      setPeople(sortedData);
    } catch (err) {
      console.error('Error fetching people', err);
      } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'x-auth-token': token } };
  };

  const handleAdd = () => {
    setEditingPerson(null);
    setShowForm(true);
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`http://localhost:5001/api/people/${id}`, getAuthHeaders());
        fetchPeople(); // Refresh the list
      } catch (err) {
        console.error('Error deleting person', err);
        alert('Failed to delete entry.');
      }
    }
  };

  const handleSave = async (personData) => {
    try {
      if (editingPerson) {
        // Update existing person
        await axios.put(`http://localhost:5001/api/people/${editingPerson._id}`, personData, getAuthHeaders());
      } else {
        // Add new person
        await axios.post('http://localhost:5001/api/people', personData, getAuthHeaders());
      }
      setShowForm(false);
      setEditingPerson(null);
      fetchPeople(); // Refresh the list
    } catch (err) {
      console.error('Error saving person', err);
      alert('Failed to save entry.');
      throw err; // Propagate error to the form component
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect after logout
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div>
            <Link to="/" className="dashboard-link">View Book</Link>
            <button onClick={handleLogout} className="btn">Logout</button>
          </div>
        </div>
        <button onClick={handleAdd} className="btn btn-primary add-new-btn">Add New Person</button>
        <div className="people-list">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            people.map(person => (
              <div key={person._id} className="person-item">
                <span>{person.name}</span>
                <div className="person-actions">
                  <button onClick={() => handleEdit(person)} className="btn">Edit</button>
                  <button onClick={() => handleDelete(person._id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showForm && (
        <PersonForm
          currentPerson={editingPerson}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
};

export default DashboardPage;
