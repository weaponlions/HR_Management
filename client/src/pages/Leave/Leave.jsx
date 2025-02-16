import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa';
import Select from '../../components/Select';
import Modal from './Modal';
import LeaveCalendar from '../Items/LeaveCalendar';
import { getLeave, addNewLeave, updateLeaveStatus, downloadLeaveDocument } from '../../services/leaveService';
import { FiFile } from 'react-icons/fi';

const statusList = ["Status", "Pending", "Approved", "Rejected"];

const Leave = () => {
    const [modal, setModal] = useState(false);
    const [status, setStatus] = useState(statusList[0]);

    const toggleModel = (val) => {
        setModal(val)
    }

    const [leaves, setLeaves] = useState([]);
    const [search, setSearch] = useState("");
    const [addLeave, setAddLeave] = useState({ name: "", position: "", startDate: "", endDate: "" });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const data = await getLeave(search, (status != "" && status != "Status" ? status : ""));
            setLeaves(data);
        } catch (error) {
            console.error("Error fetching leave", error);
        }
    };


    const handleAddLeave = async (data) => {
        try {
            await addNewLeave(data);
            fetchLeaves();
            setAddLeave({});
        } catch (error) {
            console.error("Error adding employee", error);
        }
    };

    const changeStatus = (_id, val) => {
        updateLeaveStatus(_id, val)
        fetchLeaves();
    }


    useEffect(() => {
        fetchLeaves();
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
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <button onClick={() => toggleModel(true)} className="candidate_button">Add Leave</button>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <div className="table-container">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Docs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves?.map((emp, index) => (
                                <tr key={emp.id}>
                                    <td data-label="Profile">
                                        <img src={'https://randomuser.me/api/portraits/men/1.jpg'} alt={emp.employeeId.name} className="profile-pic" />
                                    </td>
                                    <td data-label="Employee Name">{emp.employeeId.name} <br /> {emp.employeeId.position}</td>
                                    <td data-label="Date">{emp.startDate} <br /> {emp.endDate}</td>
                                    <td data-label="Reason">{emp.reason}</td>
                                    <td data-label="Position">
                                        <Select options={statusList} setSelected={changeStatus} id={emp.id} selected={emp.status} />
                                    </td>
                                    <td data-label="Department">
                                        <div className='icon' onClick={() => emp.documents && downloadLeaveDocument(emp.id)}>
                                            <FiFile color={!emp.documents ? "#bbb" : ""} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <LeaveCalendar />
            </div>
            {modal && <Modal data={addLeave} handleSubmit={handleAddLeave} setData={setAddLeave} onClose={toggleModel} />}
        </div>
    )
}

export default Leave;