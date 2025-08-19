import React, { useState, useEffect } from 'react';
import './PersonForm.css';

const PersonForm = ({ currentPerson, onSave, onCancel }) => {
  const [person, setPerson] = useState({ name: '', biography: '' });
const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (currentPerson) {
      setPerson(currentPerson);
    } else {
      setPerson({ name: '', biography: '' });
    }
  }, [currentPerson]);

  const onChange = e => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(person);
    } catch (error) {
      // Error is handled by the parent, we just need to stop the loading state.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="form-modal-backdrop">
      <div className="form-modal">
        <h2>{currentPerson ? 'Edit Person' : 'Add New Person'}</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={person.name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="biography">Biography</label>
            <textarea
              name="biography"
              value={person.biography}
              onChange={onChange}
              rows="10"
              required
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;