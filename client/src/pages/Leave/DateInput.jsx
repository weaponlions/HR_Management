import React, { useEffect, useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = ({label, required, name, onChange, value=null, noColor, pastDisable=false, width="200px", weight=500, radius="20px", border="1px solid #ccc"}) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();
  const containerRef = useRef(null); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="date-picker-container">
      <div className="input-container" style={{width: width, borderRadius: radius, border: border}} onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          name={name}
          placeholder={" "}
          value={value ? value.toLocaleDateString() : ""}
          readOnly
          {...(required && {required: true})}
          className="input-field"
        />
        <FaRegCalendarAlt className="calendar-icon" />

        <label className={`date-label ${value && "date-label2"}`} style={{color: noColor ? "#666" : "#6b21a8", fontWeight: weight}}>
          {label} {required && <span className="required">*</span>}
        </label>
      </div>
      {isOpen && (
        <div className="calendar-popup">
          <DatePicker
            selected={value}
            {...(pastDisable && {minDate: today})}
            onChange={(date) => {
              const e = Object.assign(document.createElement("input"), {type: "text", value: date, name: name});
              
              e.addEventListener("input", (e) => {
                onChange(e);
              });
              document.body.appendChild(e);
              e.value = date;
              e.dispatchEvent(new Event("input"));
              setIsOpen(false);
            }}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
