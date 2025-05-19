import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../../store/auth/authSlice';
import { addNotification } from '../../../store/notifications/notificationsSlice';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Registration.css';
import { registrationSchema } from '../../../validation/schemas'; 

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: '',
  });

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = registrationSchema.safeParse(formData);

    if (!result.success) {
      const shown = new Set();
      result.error.errors.forEach((err) => {
        const msg = err.message;
        const key = `${err.path.join(".")}:${msg}`;
        if (!shown.has(key)) {
          shown.add(key);
          dispatch(addNotification(msg, "error"));
        }
      });
      return;
    }

    dispatch(registerUser(result.data))
      .unwrap()
      .then(() => {
        dispatch(addNotification("Registrace proběhla úspěšně!", "success"));
        setTimeout(() => navigate("/login"), 2000);
      });
  };

  useEffect(() => {
    if (error) {
      dispatch(addNotification(error, 'error'));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <motion.div
      className="registration-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      <button className="registration-back-button">
        <Link to="/" className="registration-link-to-landingpage">
          <i className="ri-arrow-left-line back-button-arrow"></i>
        </Link>
      </button>
      <div className="registration-form-wraper">
        <h2 className="registration-header">Registrace</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="registration-input-box">
            <input
              className="registration-form-input"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <i className="ri-user-fill registration-icon"></i>
          </div>
          <div className="registration-input-box">
            <input
              className="registration-form-input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <i className="ri-mail-fill registration-icon"></i>
          </div>
          <div className="registration-input-box">
            <input
              className="registration-form-input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <i className="ri-key-fill registration-icon"></i>
          </div>
          <div className="registration-input-box">
            <select
              className="registration-form-input"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Vyberte pohlaví</option>
              <option value="male">Muž</option>
              <option value="female">Žena</option>
              <option value="other">Jiné</option>
            </select>
          </div>
          <button type="submit" className="registration-form-button" disabled={loading}>
            {loading ? 'Registruji...' : 'Registrovat se'}
          </button>
          <span className="registration-link-box">
            <p className="registration-link-description">Už máte účet?</p>
            <Link to="/login" className="registration-link-to-registration">
              <p>Přihlásit se</p>
            </Link>
          </span>
        </form>
      </div>
    </motion.div>
  );
};

export default Register;

