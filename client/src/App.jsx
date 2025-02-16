import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Auth/Register";
import Candidate from "./pages/Candidate/Candidate";
import Employee from "./pages/Employee/Employee";
import Attendance from "./pages/Attendance/Attendance";
import Leave from "./pages/Leave/Leave";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} >
              <Route path="/candidate" element={<Candidate />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leave" element={<Leave />} />
            </Route>
          </Route>
        </Routes>
      </Router>
  );
};

export default App;
