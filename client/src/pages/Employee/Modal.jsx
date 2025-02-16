import React, { useState } from 'react'
import { AiOutlineCalendar, AiOutlineClose } from 'react-icons/ai';
import Input from '../Items/Input';
// import "./Modal.css"

const Modal = ({ data, onClose, setData, handleSubmit, positionList }) => {

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name == "position" && value == "Position") {
      value = "";
    }
    else setData({ ...data, [name]: value });
  };


  const onSubmit = (e) => {
    e.preventDefault();
    onClose(false);
    handleSubmit(data);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className='modal-title'>{data._id == null ? "Add New Employee" : "Edit Employee Details"}</h2>
          <AiOutlineClose className="close-icon" onClick={() => onClose(false)} />
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <Input type="text" required={true} label={"Full Name"} name="name" value={data.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <Input type="email" required={true} label={"Email Address"} name="email" value={data.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <Input type="tel" required={true} label={"Phone Number"} name="phone" value={data.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <Input type="text" required={true} label={"Department"} name="department" value={data.department} onChange={handleChange} />
            </div>

            <div className="form-group">
              <Input type="text" required={true} label={"Position"} name="position" value={data.position} onChange={handleChange} />
            </div>

            {/* <div className="form-group">
              <select name="position" value={data.position} onChange={handleChange}>
                {
                  positionList?.map((v) => <option key={v} value={v}>{v}</option>)
                }
              </select>
            </div> */}

            <div className="form-group">
              <div className="date-input">
                <Input type="date" required={true} label={"Date of Joining"} name="dateOfJoining" value={data.dateOfJoining} onChange={handleChange} />
                <AiOutlineCalendar className="calendar-icon" />
              </div>
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