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
import AddSalaryPage from './pages/AddSalaryPage';
import Chat from './pages/chat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    {/* <Login /> */}
    {/* <HomePage/> */}

    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage /> } />
          <Route path='employee/manage' element={<EmployeePage />} />
          <Route path='employee/new' element={<AddEmployeePage />} />
          <Route path='salary/manage' element={<SalaryPage />} />
          <Route path='salary/new' element={<AddSalaryPage />} />
          <Route path="employee/edit/:id" element={<AddEmployeePage />} />
          <Route path="salary/edit/:id" element={<AddSalaryPage />} />

          <Route path='try' element={<App />} />
          <Route path='chat' element={<Chat />} />
        </Route>
        <Route path="/login" element={<SocketProvider><Login /></SocketProvider>} />

      </Routes>
    </BrowserRouter>
  </>
);
