import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../store/auth/authSlice';
import { addNotification } from "../../../store/notifications/notificationsSlice";
import { motion } from 'framer-motion';
import { loginSchema } from '../../../validation/schemas'; // ✅ Import schématu z validace
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const result = loginSchema.safeParse(formData);
  
    if (!result.success) {
      const shown = new Set();
  
      result.error.errors.forEach((err) => {
        const msg = err.message;
        const key = `${err.path.join(".")}:${msg}`; // unikátní klíč
  
        if (!shown.has(key)) {
          shown.add(key);
          dispatch(addNotification(msg, "error"));
        }
      });
  
      return;
    }
  
    dispatch(loginUser(result.data))
      .unwrap()
      .then(() => {
        dispatch(addNotification("Přihlášení proběhlo úspěšně!", "success"));
      });
  };
  

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return (
    <motion.div
      className='login-container'
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <button className="login-back-button">
        <Link to="/" className="login-link-to-landingpage">
          <i className="ri-arrow-left-line back-button-arrow"></i>
        </Link>
      </button>

      <div className='login-form-wraper'>
        <h2 className="login-header">Login in to your account.</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-box">
            <input
              className="login-form-input"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <i className="ri-user-fill login-icon"></i>
          </div>
          <div className="login-input-box">
            <input
              className="login-form-input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <i className="ri-eye-off-fill login-icon"></i>
          </div>
          <button type="submit" className="login-form-button" disabled={loading}>
            {loading ? 'Přihlašuji...' : 'Login'}
          </button>
          <span className="login-link-box">
            <p className="login-link-description">Ještě nemáte účet?</p>
            <Link to="/register" className="login-link-to-registration">
              <p>Registrovat se</p>
            </Link>
          </span>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
