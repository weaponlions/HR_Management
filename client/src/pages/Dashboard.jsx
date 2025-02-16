import React from 'react'
import Sidebar from './Items/Sidebar'
import Header from './Items/Header'
import { Outlet, useLocation } from 'react-router-dom'


const Title = {
  "candidate": "Candidates",
  "employee": "Employees",
  "attendance": "Attendances",
  "leave": "Leaves",
}

const Dashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname?.split("/")[1] ?? "";

  return (
    <div style={{ display: "flex" }}>
      <Sidebar title={currentPath}/>
      <div style={{ flex: 1, paddingTop: 5 }}>
        <Header title={Title[currentPath]} />
        <div style={{ maxHeight: 490, overflow: "auto", minHeight: 490 }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;