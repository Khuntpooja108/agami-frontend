import React, { useState, useEffect } from 'react';
import axiosObj from '../config/Axios';
import { useNavigate, useParams } from 'react-router-dom';

function AddEmployeePage() {
  const { id } = useParams(); // Get employee ID from URL (if in edit mode)
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useeffect");
    
    if (id) {
      // Fetch the employee data if editing
      const fetchEmployee = async () => {
        try {
          const response = await axiosObj.get(`/api/employee/${id}`);

          const employeeData = response.data.data;
          setName(employeeData.name);
          setEmail(employeeData.email);
          setDept(employeeData.dept);
        } catch (error) {
          console.error("Error fetching employee data:", error);
          alert("Failed to fetch employee data.");
        }
      };
      fetchEmployee();
    }
  }, [id]);

  const handleAddOrEditEmployee = async (e) => {
    e.preventDefault();

    if (password !== conpassword) {
      alert("Passwords do not match!");
      return;
    }

    const employeeData = { name, email, dept };

    if (password) {
      employeeData.password = password;
    }

    try {
      let response;
      if (id) {
        // Update employee if in edit mode
        response = await axiosObj.put(`/api/employee/${id}`, employeeData, { validateStatus: () => true });
      } else {
        // Add new employee
        response = await axiosObj.post("/api/employee", employeeData, { validateStatus: () => true });
      }

      if (response.data?.result !== 0) {
        setName("");
        setEmail("");
        setDept("");
        setPassword("");
        setConpassword("");
        alert(response.data.message);
        navigate("/employee/manage");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error in adding or editing employee:", error);
      alert(error.response?.data?.message || "Failed to save employee data!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-400 p-10 shadow-md w-[500px]">
        <h2 className="text-2xl font-bold text-center text-gray-900">{id ? "Edit Employee" : "Add Employee"}</h2>

        <form className="mt-4" onSubmit={handleAddOrEditEmployee}>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter your Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Department</label>
            <input
              type="text"
              placeholder="Enter your Department"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              value={dept}
              required
              onChange={(e) => setDept(e.target.value)}
            />
          </div>

          {!id && (  // Password fields only visible in add mode
            <>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Enter your Confirm Password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  value={conpassword}
                  required
                  onChange={(e) => setConpassword(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gray-500 text-white font-bold py-3 mt-2 rounded-lg hover:bg-gray-600 transition"
          >
            {id ? "Save Changes" : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployeePage;
