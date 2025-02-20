import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaEllipsisV } from "react-icons/fa";

const Dropdown = ({ type, list, disabled = false }) => {
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
    <div ref={containerRef} className="profile-dropdown">
      <button className="profile-btn" {...(disabled && { disabled: true })} onClick={() => setIsOpen(!isOpen)}> 
        {
          type == "Menu" && <img src="./avatar.png" alt="Profile" className="profile-img" />
        }
        {
          type == "Menu" && (isOpen ? <FaChevronUp color={disabled ? "#bbb" : ""} className="icon" /> : <FaChevronDown color={disabled ? "#bbb" : ""} className="icon" />)
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
