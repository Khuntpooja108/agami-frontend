import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Header from './pages/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EmployeePage from './pages/EmployeePage';
import SalaryPage from './pages/SalaryPage';
import Sidebar from './pages/Sidebar';
import Layout from './pages/Layout';
import { SocketProvider } from './context/SocketContext';
import AddEmployeePage from './pages/AddEmployeePage';
import App from './pages/Try';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    {/* <Login /> */}
    {/* <HomePage/> */}

    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<SocketProvider><HomePage /></SocketProvider> } />
          <Route path='employee/manage' element={<EmployeePage />} />
          <Route path='employee/new' element={<AddEmployeePage />} />
          <Route path='salary' element={<SalaryPage />} />
          <Route path='try' element={<App />} />
        </Route>
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  </>
);
