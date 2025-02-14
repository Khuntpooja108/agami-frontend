import React, { useState } from 'react'
import axiosObj from '../config/Axios';

function AddEmployeePage() {
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (password !== conpassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Sending API request...");
    try {
      const response = await axiosObj.post("/api/employee", { name, email, password, dept }, { validateStatus: () => true });

      console.log("API Response:", response.data);

      if (response.data?.result !== 0) {
        setName("");
        setEmail("");
        setDept("");
        setPassword("");
        setConpassword("");
        alert(response.data.message)

      } else {
        alert(response.data.message)
      }

    } catch (error) {
      console.error("Add Emp Error:", error);
      alert(error.response?.data?.message || "Failed to add employee!");

    }

  }


  return (

    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-400 p-10  shadow-md w-[500px]">
          <h2 className="text-2xl font-bold text-center text-gray-900">Add Employee</h2>

          <form className="mt-4" onSubmit={handleAddEmployee}>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                value={name} required onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                value={email}
                required onChange={(e) => setEmail(e.target.value)}
              />
            </div>



            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Department
              </label>
              <input
                type="text"
                placeholder="Enter your Department"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                value={dept}
                required onChange={(e) => setDept(e.target.value)}
              />
            </div>


            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                value={password}
                required onChange={(e) => setPassword(e.target.value)}

              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Enter your Confirm Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                value={conpassword}
                required onChange={(e) => setConpassword(e.target.value)}

              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-500 text-white font-bold py-3 mt-2 rounded-lg hover:bg-gray-600 transition"
            >
              Add Employee
            </button>
          </form>

        </div>
      </div>


    </>)
}

export default AddEmployeePage