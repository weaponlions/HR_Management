import React, { useState, useEffect } from 'react'
import { FaEllipsisV, FaSearch } from 'react-icons/fa';
import Select from '../../components/Select';
import Modal from './Modal';
import Dropdown from '../Items/Dropdown';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, getEmployeePosition } from "../../services/employeeService";

const statusList = ["Status", "New", "Scheduled", "Ongoing", "Selected", "Rejected"];
// const positionList = ["Position", "Designer", "Human Resource", "Developer"];

const Employee = () => {
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState(statusList[0]);
  const [position, setPosition] = useState("Position");
  const [positionList, setPositionList] = useState([]);

  const toggleModel = (val) => {
    setModal(val)
  }

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editingEmployee, setEditingEmployee] = useState({ name: "", email: "", phone: "", department: "", position: "", dateOfJoining: "", _id: null, role: "Employee" });

  useEffect(() => {
    fetchEmployees();
    fetchPosition();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees(search, (position != "" && position != "Position" ? position : ""));
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const fetchPosition = async () => {
    try {
      const data = await getEmployeePosition(search);
      setPositionList(["Position", ...data.positions]);
    } catch (error) {
      console.error("Error fetching candidates", error);
    }
  };

  const handleAddEmployee = async (data) => {
    try {
      await addEmployee(data);
      fetchEmployees();
      setEditingEmployee({ name: "", email: "", phone: "", department: "", position: "", dateOfJoining: "", _id: null });
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  const handleUpdateEmployee = async (data) => {
    try {
      if (data._id == null) {
        return handleAddEmployee(data)
      }
      await updateEmployee(data._id, data);
      fetchEmployees();
      setEditingEmployee({ name: "", email: "", phone: "", department: "", position: "", dateOfJoining: "", _id: null });
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
      fetchEmployees();
    }
  };


  useEffect(() => {
    fetchEmployees();
  }, [position, search])

  return (
    <div>
      <div className="candidate_SearchBox">
        <div className="candidate_SearchBox_left">
          <Select options={positionList} setSelected={setPosition} selected={position} />
        </div>
        <div className="candidate_SearchBox_right">
          <div className="sidebar-search-box">
            <FaSearch className="sidebar-search-icon" />
            <input type="text" placeholder="Search" style={{ margin: 0 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <button onClick={() => toggleModel(true)} className="candidate_button">Add Employee</button>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((emp, index) => (
              <tr key={emp._id}>
                <td data-label="Profile">
                  <img src={'https://randomuser.me/api/portraits/men/1.jpg'} alt={emp.name} className="profile-pic" />
                </td>
                <td data-label="Employee Name">{emp.name}</td>
                <td data-label="Email Address" data-full-text={emp.email}>{emp.email}</td>
                <td data-label="Phone Number">{emp.phone}</td>
                <td data-label="Position">{emp.position}</td>
                <td data-label="Department">{emp.department}</td>
                <td data-label="Date of Joining">{emp.dateOfJoining}</td>
                <td data-label="Action">
                  <Dropdown type={"Dot"} list={[
                    <li key={0} onClick={() => { setEditingEmployee(emp); setModal(true) }}>Edit</li>,
                    <li key={1} onClick={() => handleDelete(emp._id)}>Delete</li>,
                  ]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <Modal data={editingEmployee} positionList={positionList} handleSubmit={handleUpdateEmployee} setData={setEditingEmployee} onClose={toggleModel} />}
    </div>
  )
}

export default Employee;