import React, { useState } from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaCode } from 'react-icons/fa';
import './RoleModal.css';

const RoleModal = ({ onSelectRole, showToast }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    } else {
      showToast('Please select a role', 'warning');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="role-modal">
        <div className="role-modal-header">
          <FaCode className="logo-icon" />
          <span>CollabCode</span>
        </div>
        
        <h2>Select Your Role</h2>
        <p className="subtitle">Choose how you want to use CollabCode</p>
        
        <div className="role-options">
          <div 
            className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('teacher')}
          >
            <FaChalkboardTeacher className="role-icon" />
            <h3>Teacher</h3>
            <p>Create classrooms, share code, and guide students</p>
          </div>
          
          <div 
            className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('student')}
          >
            <FaUserGraduate className="role-icon" />
            <h3>Student</h3>
            <p>Join classrooms, collaborate, and learn coding</p>
          </div>
        </div>
        
        {selectedRole && (
          <button className="btn btn-primary btn-lg" onClick={handleConfirm}>
            Continue as {selectedRole}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoleModal;