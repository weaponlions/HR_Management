import React, { useState, useEffect } from 'react'
import { FaEllipsisV, FaSearch } from 'react-icons/fa';
import Select from '../../components/Select';
import Dropdown from '../Items/Dropdown';
import { getAttendance, markAttendance } from '../../services/attendanceService';

const statusList = ["Status", "Present", "Absent", "Medical Leave", "Work from Home"];

const Attendance = () => {
    const [status, setStatus] = useState(statusList[0]);

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchEmployees(); 
    }, []);

    const fetchEmployees = async () => {
        try {
            const data = await getAttendance(search, (status != "" && status != "Status" ? status : ""));
            setEmployees(data.data);
        } catch (error) {
            console.error("Error fetching employees", error);
        }
    };

      const changeStatus = (_id, val) => {
        markAttendance(_id, val)
        const list = employees.map((v) => v.employee._id == _id ? {...v, attendanceStatus: val} : v)
        setEmployees(list);
      }

    useEffect(() => {
        fetchEmployees();
    }, [status, search])

    return (
        <div>
            <div className="candidate_SearchBox">
                <div className="candidate_SearchBox_left">
                <Select options={statusList} setSelected={setStatus} selected={status} />
                </div>
                <div className="candidate_SearchBox_right">
                    <div className="sidebar-search-box">
                        <FaSearch className="sidebar-search-icon" />
                        <input type="text" placeholder="Search" style={{ margin: 0 }} value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="table-container">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Profile</th>
                            <th>Employee Name</th>
                            <th>Position</th>
                            <th>Department</th>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees?.map((emp, index) => (
                            <tr key={emp.employee._id}>
                                <td data-label="Profile">
                                    <img src={'https://randomuser.me/api/portraits/men/1.jpg'} alt={emp.name} className="profile-pic" />
                                </td>
                                <td data-label="Employee Name">{emp.employee.name}</td>
                                <td data-label="Position">{emp.employee.position}</td>
                                <td data-label="Department">{emp.employee.department}</td> 
                                <td data-label="Task">{emp.employee.task}</td>
                                <td data-label="Status">
                                    <Select options={statusList} setSelected={changeStatus} id={emp.employee._id} selected={emp.attendanceStatus ?? "Status"} />
                                </td>
                                <td data-label="Action">
                                    <Dropdown type={"Dot"} list={[]} disabled={true} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Attendance;