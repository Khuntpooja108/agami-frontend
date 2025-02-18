import React, { useEffect, useState } from "react";
import axiosObj from "../config/Axios";
import { useNavigate, useParams } from "react-router-dom";

function AddSalaryPage() {
  const { id } = useParams(); 

  const [eid, setEid] = useState("");
  const [samount, setSamount] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    console.log("useeffect");
    
    if (id) {
      
      const fetchSalary = async () => {
        try {
          const response = await axiosObj.get(`/api/salary/${id}`);

          const salaryData = response.data.data;
          setEid(salaryData.eid);
          setSamount(salaryData.samount);
        } catch (error) {
          console.error("Error fetching salary data:", error);
          alert("Failed to fetch salary data.");
        }
      };
      fetchSalary();
    }
  }, [id]);

  const handleAddOrEditSalary= async (e) => {
    e.preventDefault();

  

    const salaryData = { eid, samount };

 
    try {
      let response;
      if (id) {
        
        response = await axiosObj.put(`/api/salary/${id}`, salaryData, { validateStatus: () => true });
      } else {
        
        response = await axiosObj.post("/api/salary", salaryData, { validateStatus: () => true });
      }

      if (response.data?.result !== 0) {
        setEid("");
        setSamount("");
        alert(response.data.message);
        navigate("/salary/manage");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error in adding or editing salary:", error);
      alert(error.response?.data?.message || "Failed to save salary data!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-400 p-10 shadow-md w-[500px]">
        <h2 className="text-2xl font-bold text-center text-gray-900">Add Salary</h2>
        <form className="mt-4" onSubmit={handleAddOrEditSalary}>
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
