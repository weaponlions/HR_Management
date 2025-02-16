import React, { useState } from 'react'
import { AiOutlineCalendar, AiOutlineClose } from 'react-icons/ai';
import Input from '../Items/Input';
import { getEmployees } from '../../services/employeeService';
// import "./Modal.css"

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

const Modal = ({ data, onClose, setData, handleSubmit }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const reqData = await getEmployees(data.name, "");
      setEmployees(reqData.employees);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };
  const debouncedSearch = debounce(fetchEmployees, 500);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name == "name") {
      setIsOpen(true)
      debouncedSearch(value)
    }
    setData({ ...data, [name]: value });
  };


  const onSelect = (v) => { 
    setData((prev) => ({...prev, employeeId: v._id, position: v.position, name: v.name}))
    setIsOpen(false);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", data.name);   
    formdata.append("position", data.position);
    formdata.append("startDate", data.startDate);
    formdata.append("endDate", data.endDate);
    formdata.append("documents", data.documents);
    formdata.append("reason", data.reason);
    formdata.append("employeeId", data.employeeId); 
    handleSubmit(formdata);
    onClose(false);
  }

  const handleFileChange = (e) => {
    setData({ ...data, documents: e.target.files[0] });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className='modal-title'>{"Add New Leave"}</h2>
          <AiOutlineClose className="close-icon" onClick={() => onClose(false)} />
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group" style={{ position: "relative" }}>
              <Input type="text" required={true} label={"Full Name"} name="name" value={data.name} onChange={handleChange} />
              {isOpen && <ul className="dropdown-menu2">
                {
                  employees.map((v) => <li onClick={() => onSelect(v)} key={v._id}>{v.name}</li>)
                }
              </ul>}
            </div>

            <div className="form-group">
              <Input type="text" required={true} label={"Designation"} name="position" value={data.position} onChange={handleChange} />
            </div>

            <div className="form-group">
              <Input type="date" required={true} label={"Start Date"} name="startDate" value={data.startDate} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <Input type="date" required={true} label={"End Date"} name="endDate" value={data.endDate} onChange={handleChange} />
            </div>

            <div className="form-group">
              <Input type="text" required={true} label={"Reason"} name="reason" value={data.reason} onChange={handleChange} />
            </div>

            <div className="form-group">
              <Input type="file" label={"Douments"} name="documents" value={data.department} onChange={handleFileChange} />
            </div>

          </div>

          {/* Save Button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button style={{ width: 100, margin: "10px" }} className="candidate_button">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal