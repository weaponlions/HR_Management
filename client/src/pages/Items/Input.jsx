import React, { useState } from "react";

const Input = ({ label, required, name, onChange, value, type }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`input-container ${focused ? "focused" : ""}`}>
      <input
        type={type ?? "text"}
        className="input-field"
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
        placeholder=" " 
        name={name}
        onChange={onChange}
        value={value}
        {...(required && {required: true})}
      />
      <label className="input-label">
        {label} {required && <span className="required">*</span>}
      </label>
    </div>
  );
};

export default Input;
