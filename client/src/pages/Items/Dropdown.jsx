import React, { useState } from "react";
import "./Dropdown.css";
import { FaChevronDown, FaChevronUp, FaEllipsisV  } from "react-icons/fa";

const Dropdown = ({type, list, disabled=false}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="profile-dropdown">
      <button className="profile-btn" {...(disabled && { disabled: true})} onClick={() => setIsOpen(!isOpen)}>
        { type == "Menu" && <img src="./avatar.png" alt="Profile" className="profile-img" />}
        {
          type == "Menu" && (isOpen ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />) 
        }
        {
          type == "Dot" && <FaEllipsisV color={disabled ? "#bbb" : ""} className={`icon`} />
        }
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
            {
              list?.map((v) => v)
            }
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
