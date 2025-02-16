import React, { useState } from "react";
import "./Select.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Select = ({options, selected, setSelected, id=null}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="select-dropdown">
      <button className="select-dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {selected} {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <ul className="select-dropdown-menu">
          {options.map((option, index) => (
            <li key={index} onClick={() => { id ? setSelected(id, option) : setSelected(option); setIsOpen(false); }}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
