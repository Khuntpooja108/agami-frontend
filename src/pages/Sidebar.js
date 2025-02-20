import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaMoneyBill, FaComments } from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sticky top-0 left-0 h-screen h-min-screen  bg-gray-800 text-white ${isCollapsed ? 'w-16' : 'w-60'} transition-width duration-300`}>
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && <h1 className="text-lg font-bold">Admin Panel</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white">
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        <li>
          <NavLink to="/" className="flex items-center p-3 hover:bg-gray-700">
            <FaTachometerAlt className="text-xl" />
            {!isCollapsed && <span className="ml-4">Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/employee/manage" className="flex items-center p-3 hover:bg-gray-700">
            <FaUser className="text-xl" />
            {!isCollapsed && <span className="ml-4">Employee</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/salary/manage" className="flex items-center p-3 hover:bg-gray-700">
            <FaMoneyBill className="text-xl" />
            {!isCollapsed && <span className="ml-4">Salary</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat" className="flex items-center p-3 hover:bg-gray-700">
            <FaComments className="text-xl" />
            {!isCollapsed && <span className="ml-4">Chat</span>}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
