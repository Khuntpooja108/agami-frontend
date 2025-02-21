import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

function HomePage() {
  const { socket } = useSocket();
  
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalSalaries, setTotalSalaries] = useState(0);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [highestPaidEmployees, setHighestPaidEmployees] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("request_initial_data");

    socket.on("update_total_employees", (count) => setTotalEmployees(count));
    socket.on("update_total_salaries", (total) => setTotalSalaries(total));
    socket.on("update_recent_employees", (data) => setRecentEmployees(data));
    socket.on("update_highest_paid", (data) => setHighestPaidEmployees(data));

    return () => {
      socket.off("update_total_employees");
      socket.off("update_total_salaries");
      socket.off("update_recent_employees");
      socket.off("update_highest_paid");
    };
  }, [socket]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-lg font-semibold">Total Employees</h2>
          <p className="text-4xl font-bold">{totalEmployees}</p>
        </div>

        <div className="bg-gray-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-lg font-semibold">Total Salaries</h2>
          <p className="text-4xl font-bold">₹{totalSalaries.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Employees</h2>
        {recentEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{emp.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{emp.dept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent employees found.</p>
        )}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Highest Paid Employees</h2>
        {highestPaidEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Employee ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Salary (₹)</th>
                </tr>
              </thead>
              <tbody>
                {highestPaidEmployees.map((emp, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{emp.eid}</td>
                    <td className="border border-gray-300 px-4 py-2">₹{emp.samount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
