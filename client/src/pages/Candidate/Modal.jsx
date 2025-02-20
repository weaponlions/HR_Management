import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import Input from '../Items/Input';

const Modal = ({ data, onClose, setData, handleSubmit }) => {

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const [checked, setChecked] = useState(data._id == null ? false : true);

  const onSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("email", data.email);
    formdata.append("phone", data.phone);
    formdata.append("position", data.position);
    formdata.append("experience", data.experience);
    formdata.append("resume", data.resume); 
    let _id = data._id ?? null;
    if(_id) formdata.append("_id", _id); 
    onClose(false);
    handleSubmit(formdata, _id);
  }
  const handleFileChange = (e) => {
    setData({ ...data, resume: e.target.files[0] });
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className='modal-title'>
            {
              data._id == null ? "Add New Candidate" : "Edit Candidate Details"
            }
            </h2>
          <AiOutlineClose className="close-icon" onClick={() => onClose(false)} />
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <Input label={"Full name"} required={true} name="name" value={data.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <Input label={"Email Address"} required={true} name="email" value={data.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <Input label={"Phone Number"} required={true} name="phone" value={data.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <select name="position" value={data.position} onChange={handleChange}>
                <option value="Intern">Intern</option>
                <option value="Full Time">Full Time</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Team Lead">Team Lead</option>
              </select>
            </div>

            
            <div className="form-group">
              <Input label={"Experience"} required={true} name="experience" value={data.experience} onChange={handleChange} />
            </div>

            <div className="form-group">
              <div className="date-input">
                <Input label={"Resume"} type={"file"} required={false} onChange={handleFileChange} />
              </div>
            </div>
          </div>
          <div style={{ padding: "0px 25px" }}>
            <label className="checkbox" style={{ color: "#A4A4A4" }}>
              <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
              <span className="checkmark"></span>
              <p style={{ paddingLeft: 5 }}> I hereby declare that the above information is true to the best of my knowledge and belief</p>
            </label>
          </div>
          {/* Save Button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type='submit' style={{ width: 100, margin: "10px" }} className="candidate_button" disabled={!checked} >Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal