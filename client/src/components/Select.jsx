import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Select = ({options, selected, setSelected, id=null}) => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div ref={containerRef} className="select-dropdown">
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
