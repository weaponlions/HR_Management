import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Items/Loader";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true)
    try {
      const { token } = await login(email, password);
      // localStorage.setItem("token", token);
      setToken(token)
      navigate("/", {replace: true});
    } catch (error) {
      alert("Invalid credentials");
    }
    setLoading(false)
  };

  return (
    <div className="auth-main">
      <div className="auth-logo">LOGO</div>
      <div className="auth-container">
        <div className="auth-left-section">
          <img src="register.png" alt="Dashboard Preview" className="auth-dashboard-img" />
          <p className="auth-heading-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
          <p>
            Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="auth-right-section">
          <form onSubmit={handleSubmit}>
            <h2>Welcome to Dashboard</h2>

            <div className="auth-inputBody">
              <label>Email Address<span className="auth-error-span">*</span></label>
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="auth-inputBody">
              <label>Password<span className="auth-error-span">*</span></label>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <p className="auth-forgot-password" style={{textAlign: "left", color: "#a7a7a7", margin: 0}}>Forgot Password?</p>

            <button type="submit" className="auth-button">
              {loading ? <Loader size={10} color="white" /> : "Login"}
            </button>
            <p className="auth-text" style={{textAlign: "left", color: "#a7a7a7"}}>
              Don't have an account? <Link to="/register" className="auth-link">Register</Link>
            </p>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
