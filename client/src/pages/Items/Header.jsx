import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import Dropdown from "./Dropdown";

const Header = ({title}) => {
  return (
    <div className="header">
      <div className="header-left">{title}</div>
      <div className="header-right">
      <div className="header-notification-icon">
        <AiOutlineMail className="header-icon" />
        </div>
        
        <div className="header-notification-icon">
          <IoMdNotificationsOutline className="header-icon" />
          <span className="header-notification-badge"></span>
        </div>

        <div className="header-profile-container">
          <Dropdown type={"Menu"} list={[
          <li key={0}>Edit Profile</li>,
          <li key={1}>Change Password</li>,
          <li key={2}>Manage Notification</li>
          ]} />
        </div>
      </div>
    </div>
  );
};

export default Header;
