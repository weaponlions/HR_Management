import React, { useEffect, useState } from 'react'
import "./Candidate.css"
import { FaSearch } from 'react-icons/fa';
import Select from '../../components/Select';
import Modal from './Modal';
import Dropdown from '../Items/Dropdown';
import { getCandidates, addCandidate, deleteCandidate, downloadResume, getCandidatePosition, updateCandidate, updateCandidateStatus } from "../../services/candidateService";


const statusList = ["Status", "New", "Applied", "Scheduled", "Ongoing", "Selected", "Rejected"];
// const positionList = ["Position", "Designer", "Human Resource", "Developer"];

const Candidate = () => {
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState(statusList[0]);
  const [position, setPosition] = useState("Position");
  const [positionList, setPositionList] = useState([]);

  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [newCandidate, setNewCandidate] = useState({ name: "", email: "", phone: "", experience: "", position: "", resume: null, _id: null, status: "Applied" });

  useEffect(() => {
    fetchCandidates();
    fetchPosition();
  }, []);

  const fetchCandidates = async () => {
    try {
      const data = await getCandidates(search, (position != "" && position != "Position" ? position : ""), (status != "" && status != "Status" ? status : ""));
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Error fetching candidates", error);
    }
  };

  const fetchPosition = async () => {
    try {
      const data = await getCandidatePosition(search);
      setPositionList(["Position", ...data.positions]);
    } catch (error) {
      console.error("Error fetching candidates", error);
    }
  };

    const handleUpdateCandidate = async (data, _id) => {
        try {
          await updateCandidate(_id, data);
          fetchCandidates();
          setNewCandidate({ name: "", email: "", phone: "", experience: "", position: "", resume: null, status: "Applied", _id: null });
        } catch (error) {
          console.error("Error updating candidate", error);
        }
      };

  const handleAddCandidate = async (data, _id = null) => {
    try {
      if (_id != null) {
        return handleUpdateCandidate(data, _id)
      }
      await addCandidate(data);
      fetchCandidates();
      setNewCandidate({ name: "", email: "", phone: "", experience: "", position: "", resume: null, status: "Applied", _id: null });
    } catch (error) {
      console.error("Error adding candidate", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      await deleteCandidate(id);
      fetchCandidates();
    }
  };

  const toggleModel = (val) => {
    setModal(val)
  }

  useEffect(() => {
    fetchCandidates();
  }, [status, position, search])

  const changeStatus = (_id, val) => {
    updateCandidateStatus(_id, val)
    if(val === "Selected") {
      fetchCandidates();
    }
    // update Candidates
    const list = candidates.map((v) => v._id == _id ? {...v, status: val} : v)
    setCandidates(list);
  }

  return (
    <div>
      <div className="candidate_SearchBox">
        <div className="candidate_SearchBox_left">
          <Select options={statusList} setSelected={setStatus} selected={status} />
          <Select options={positionList} setSelected={setPosition} selected={position} />
        </div>
        <div className="candidate_SearchBox_right">
          <div className="sidebar-search-box">
            <FaSearch className="sidebar-search-icon" />
            <input type="text" placeholder="Search" style={{ margin: 0 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <button onClick={() => {toggleModel(true); setNewCandidate({})}} className="candidate_button">Add Candidate</button>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Candidate Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates?.map((val, index) => (
              <tr key={val._id}>
                <td data-label="Profile">
                  {(index) < 9 ? `0${index + 1}` : `${index + 1}`}
                </td>
                <td data-label="Employee Name">{val.name}</td>
                <td data-label="Email Address" data-full-text={val.email}>{val.email}</td>
                <td data-label="Phone Number">{val.phone}</td>
                <td data-label="Position">{val.position}</td>
                <td data-label="Department">              
                  <Select options={statusList} setSelected={changeStatus} id={val._id} selected={val.status} />
                </td>
                <td data-label="Experience">{val.experience}</td>
                <td data-label="Action">
                  <Dropdown type={"Dot"} list={[
                    <li key={0} onClick={() => { toggleModel(true); setNewCandidate(val) }}>Edit Candidate</li>,
                    <li key={1} onClick={() => downloadResume(val._id)}>Download Resume</li>,
                    <li key={2} onClick={() => handleDelete(val._id)}>Delete Candidate</li>
                  ]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <Modal data={newCandidate} statusList={statusList} onClose={toggleModel} setData={setNewCandidate} handleSubmit={handleAddCandidate} />}
    </div>
  )
}

export default Candidate;