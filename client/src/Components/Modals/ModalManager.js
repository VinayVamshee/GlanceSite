import React, { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { useUI } from '../../contexts/UIContext';
import { useAuth } from '../../contexts/AuthContext';
import { feedbackService } from '../../services/feedback.service';
import srinivas from '../../Components/SrinivasRao.png';
import './ModalManager.css';

export default function ModalManager() {
  const { activeModal, closeModal, openModal } = useUI();
  const { login, register, adminLogin, adminRegister } = useAuth();

  // Auth Forms State
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', phoneno: '' });
  const [adminData, setAdminData] = useState({ username: '', password: '' });

  // Feedback State
  const [feedbackForm, setFeedbackForm] = useState({ name: '', message: '' });
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Fetch feedbacks for admin
  useEffect(() => {
    if (activeModal === 'feedbacksList') {
      const fetchFeedbacks = async () => {
        setLoadingFeedback(true);
        try {
          const list = await feedbackService.getFeedbacks();
          setFeedbacks(list);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingFeedback(false);
        }
      };
      fetchFeedbacks();
    }
  }, [activeModal]);

  // Auth actions
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginData);
      alert('Login Successful!');
      closeModal();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Login failed.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(registerData);
      alert('Registration Successful. Please login.');
      openModal('login');
    } catch (err) {
      console.error(err);
      alert('Registration failed.');
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(adminData);
      alert('Admin Login Successful!');
      closeModal();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Admin login failed.');
    }
  };

  const handleAdminRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminRegister(registerData);
      alert('Admin registration successful!');
      openModal('adminLogin');
    } catch (err) {
      console.error(err);
      alert('Admin registration failed.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedbackService.submitFeedback(feedbackForm.name, feedbackForm.message);
      alert('Thank you for your valuable feedback!');
      setFeedbackForm({ name: '', message: '' });
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback.');
    }
  };

  return (
    <>
      {/* 1. Login Modal */}
      <Modal isOpen={activeModal === 'login'} onClose={closeModal} title="Sign In" size="sm">
        <form onSubmit={handleLoginSubmit} className="modal-form">
          <label>Username</label>
          <input 
            type="text" 
            placeholder="Enter username" 
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            required 
          />
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter password" 
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required 
          />
          <div className="modal-actions-spaced">
            <Button type="button" variant="ghost" onClick={() => openModal('register')}>
              New User? Register
            </Button>
            <Button type="submit">Sign In</Button>
          </div>
        </form>
      </Modal>

      {/* 2. Register Modal */}
      <Modal isOpen={activeModal === 'register'} onClose={closeModal} title="Create Account" size="sm">
        <form onSubmit={handleRegisterSubmit} className="modal-form">
          <label>Username *</label>
          <input 
            type="text" 
            placeholder="Enter username" 
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            required 
          />
          <label>Password *</label>
          <input 
            type="password" 
            placeholder="Create password" 
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            required 
          />
          <label>Phone Number (Optional)</label>
          <input 
            type="number" 
            placeholder="Enter phone number" 
            value={registerData.phoneno}
            onChange={(e) => setRegisterData({ ...registerData, phoneno: e.target.value })}
          />
          <div className="modal-actions-spaced">
            <Button type="button" variant="ghost" onClick={() => openModal('login')}>
              Back to Login
            </Button>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </Modal>

      {/* 3. Admin Login Modal */}
      <Modal isOpen={activeModal === 'adminLogin'} onClose={closeModal} title="Admin Authentication" size="sm">
        <form onSubmit={handleAdminLoginSubmit} className="modal-form">
          <label>Admin Username</label>
          <input 
            type="text" 
            placeholder="Enter admin username" 
            value={adminData.username}
            onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
            required 
          />
          <label>Admin Password</label>
          <input 
            type="password" 
            placeholder="Enter admin password" 
            value={adminData.password}
            onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
            required 
          />
          <div className="modal-actions-spaced" style={{ justifyContent: 'flex-end' }}>
            <Button type="submit">Log In</Button>
          </div>
        </form>
      </Modal>

      {/* 4. Admin Register Modal */}
      <Modal isOpen={activeModal === 'adminRegister'} onClose={closeModal} title="Register New Admin" size="sm">
        <form onSubmit={handleAdminRegisterSubmit} className="modal-form">
          <label>New Admin Username</label>
          <input 
            type="text" 
            placeholder="Enter admin username" 
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            required 
          />
          <label>New Admin Password</label>
          <input 
            type="password" 
            placeholder="Enter admin password" 
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            required 
          />
          <div className="modal-actions-spaced">
            <Button type="button" variant="ghost" onClick={() => openModal('adminLogin')}>
              Back to Login
            </Button>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </Modal>

      {/* 5. Feedback Modal */}
      <Modal isOpen={activeModal === 'feedback'} onClose={closeModal} title="Submit System Feedback" size="md">
        <form onSubmit={handleFeedbackSubmit} className="modal-form">
          <label>Your Name</label>
          <input 
            type="text" 
            placeholder="Enter name" 
            value={feedbackForm.name}
            onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
            required 
          />
          <label>Your Message / Feedback</label>
          <textarea 
            placeholder="Describe your feedback, suggestion, or bug report..." 
            rows={4}
            value={feedbackForm.message}
            onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
            required
          />
          <div className="modal-actions-end">
            <Button type="submit">Submit Feedback</Button>
          </div>
        </form>
      </Modal>

      {/* 6. Show Feedbacks Modal (Admin Only) */}
      <Modal isOpen={activeModal === 'feedbacksList'} onClose={closeModal} title="User Feedbacks" size="md">
        {loadingFeedback ? (
          <p>Loading feedbacks...</p>
        ) : feedbacks.length === 0 ? (
          <p className="empty-state">No feedback submitted yet.</p>
        ) : (
          <div className="feedback-list">
            {feedbacks.map((f, i) => (
              <div key={i} className="feedback-item">
                <strong>{f.name}</strong>
                <p>{f.message}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* 7. About Modal */}
      <Modal isOpen={activeModal === 'about'} onClose={closeModal} title="About Project GLANCE" size="lg">
        <div className="about-modal-layout">
          <div className="about-modal-text">
            <p>
              <strong>Welcome to Glance</strong>, designed to enhance your browsing experience and save you time.
              With our platform, you can easily search for and save your favorite websites without the hassle of searching each time.
            </p>
            <p>
              Our user-friendly interface allows you to categorize your saved sites, add unique logos, and customize your experience to suit your needs.
              Simplify your online navigation and personalize your space with custom wallpapers and visual options.
            </p>
            
            <h4 className="about-subheading">Quick Start Guide</h4>
            <ul className="about-guide-list">
              <li><strong>Sign Up:</strong> Go to Login, select New User? Register, and create your account.</li>
              <li><strong>Log In:</strong> Use your credentials to log in.</li>
              <li><strong>Add Websites:</strong> Launch the Settings panel and start adding websites to categories.</li>
              <li><strong>Customize:</strong> Pin favorites, change categories, or set background wallpaper/video layers.</li>
            </ul>
          </div>
          
          <div className="about-modal-admin">
            <div className="admin-profile-card">
              <img src={srinivas} alt="Srinivas Rao" className="admin-photo" />
              <div className="admin-info">
                <strong>Srinivas Rao</strong>
                <span>Lead Administrator</span>
                <a href="tel:9752375075" className="admin-contact">📞 9752375075</a>
                <a href="mailto:cvipsecr@gmail.com" className="admin-contact">📧 cvipsecr@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="about-privacy-footer">
          🔒 <strong>Privacy Assurance:</strong> Your privacy is our top priority. All personal information and account details provided on this website are securely stored and protected against unauthorized access. We adhere to strict standards; your data is never shared with third parties.
        </div>
      </Modal>
    </>
  );
}
