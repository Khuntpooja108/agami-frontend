import React, { useState } from "react";
import axiosObj from "../config/Axios";

function AddSalaryPage() {
  const [eid, setEid] = useState("");
  const [samount, setSamount] = useState("");

  const handleAddSalary = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosObj.post(
        "/api/salary",
        { eid, samount },
        { validateStatus: () => true }
      );

      if (response.data?.result !== 0) {
        setEid("");
        setSamount("");
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Add Salary Error:", error);
      alert(error.response?.data?.message || "Failed to add salary record!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-400 p-10 shadow-md w-[500px]">
        <h2 className="text-2xl font-bold text-center text-gray-900">Add Salary</h2>
        <form className="mt-4" onSubmit={handleAddSalary}>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Employee ID
            </label>
            <input
              type="text"
              placeholder="Enter Employee ID"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              value={eid}
              required
              onChange={(e) => setEid(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Salary Amount
            </label>
            <input
              type="number"
              placeholder="Enter Salary Amount"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
              value={samount}
              required
              onChange={(e) => setSamount(e.target.value)}
            />
          </div>

          
          <button
            type="submit"
            className="w-full bg-gray-500 text-white font-bold py-3 mt-2 rounded-lg hover:bg-gray-600 transition"
          >
            Add Salary
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSalaryPage;
