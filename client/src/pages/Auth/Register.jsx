import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import Loader from "../Items/Loader";

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "HR" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true)
    if (user.name == "" || user.email == "" || user.password == "" || user.confirmPassword == "") {
      alert("All field is required.");
    }
    else if (user.password != user.confirmPassword) {
      console.log(user)
      return alert("Confirm Password does not match.");
    }
    else {
      try {
        const { token } = await register(user);
        navigate("/login");
      } catch (error) {
        alert("Registration failed. Email might already be in use.");
      }
    }
    setLoading(false)
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value })
  }

  return (
    <div className="auth-main">
      <div className="auth-logo">LOGO</div>
      <div className="auth-container">
        <div className="auth-left-section">
          <img src="register.png" alt="Dashboard Preview" className="auth-dashboard-img" />
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
          <p>
            Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="auth-right-section">
          <form onSubmit={handleSubmit}>
            <h2>Welcome to Dashboard</h2>
            <div className="auth-inputBody">
              <label>Full name<span className="auth-error_span">*</span></label>
              <input type="text" placeholder="Full name" name="name" value={user.name} onChange={inputChange} required />
            </div>

            <div className="auth-inputBody">
              <label>Email Address<span className="auth-error_span">*</span></label>
              <input type="email" placeholder="Email Address" name="email" value={user.email} onChange={inputChange} required />
            </div>

            <div className="auth-inputBody">
              <label>Password<span className="auth-error_span">*</span></label>
              <input type="password" placeholder="Password" name="password" value={user.password} onChange={inputChange} required />
            </div>

            <div className="auth-inputBody">
              <label>Confirm Password<span className="auth-error_span">*</span></label>
              <input type="password" placeholder="Confirm Password" name="confirmPassword" value={user.confirmPassword} onChange={inputChange} required />
            </div>

            <button type="submit">
              {loading ? <Loader color="white" size={10} /> : "Register"}
            </button>
            <p style={{ textAlign: "left", marginTop: "10px", color: "#A4A4A4" }}>Already have an account? <Link to="/login">Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
