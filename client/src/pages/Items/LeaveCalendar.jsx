import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getLeave } from "../../services/leaveService";

const LeaveCalendar = ({  }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const currentDate = (new Date().getDate());
    const [currentYear, setCurrentYear] = useState(2024);
    const [leaves, setLeaves] = useState([]);
    const selectedDate = [currentDate]

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const data = await getLeave("", "Approved");
            setLeaves(data);
        } catch (error) {
            console.error("Error fetching leave", error);
        }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const goToPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h3>Leave Calendar</h3>
            </div>

            <div className="calendar">
                <div className="month-nav">
                    <FaChevronLeft className="icon" onClick={goToPrevMonth} />

                    <div>
                        {new Date(currentYear, currentMonth).toLocaleString("default", {
                            month: "long",
                        })}{" "}
                        {currentYear}
                    </div>

                    <FaChevronRight className="icon" onClick={goToNextMonth} />
                </div>

                <div className="strip">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="day-label">{d}</div>
                    ))}
                </div>
                <div className="days">
                    {Array(firstDay).fill("").map((_, i) => (
                        <div key={i} className="empty"></div>
                    ))}

                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                        <div key={day} className={`day ${selectedDate.includes(day) ? "leave-day" : ""} ${day < currentDate ? "day-expired" : ""}`}>
                            {(selectedDate.includes(day) && day >= currentDate) ? <span className="badge">{day}</span> : day}
                        </div>
                    ))}
                </div>
            </div>

            <div className="approved-leaves">
                <h4>Approved Leaves</h4>
                {leaves.map((leave) => (
                    <div key={leave.id} className="leave-item">
                        <img src={'https://randomuser.me/api/portraits/men/1.jpg'} alt={leave.employeeId.name} className="profile-pic" />

                        <div className="leave-info" style={{ marginLeft: "2px" }}>
                            <strong style={{display: "inline"}}>{leave.employeeId.name}</strong> (<p style={{display: "inline"}}>{leave.employeeId.position}</p>)
                            <br />
                            <span className="date">{leave.startDate} - {leave.endDate}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaveCalendar;
