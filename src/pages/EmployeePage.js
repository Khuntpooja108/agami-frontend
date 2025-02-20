import React, { useState, useEffect, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    getExpandedRowModel,

} from "@tanstack/react-table";
import axiosObj from "../config/Axios";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { useDebounce } from "use-debounce";

import { FaChevronDown, FaChevronRight, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, } from 'react-router-dom';



import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";



function EmployeePage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [globalFilter, setGlobalFilter] = useState("");
    const [debouncedFilter] = useDebounce(globalFilter, 500);

    const { id } = useParams();
    const [password, setPassword] = useState("");
    const [conpassword, setConpassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [dept, setDept] = useState("");


    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const navigate = useNavigate();


    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
        totalRecords: 0,
    });


    const fetchData = async () => {
        try {
            setLoading(true);
            const { pageIndex, pageSize } = pagination;
            const offset = pageIndex * pageSize;

            const response = await axiosObj.get("/api/employees", {
                params: {
                    limit: pageSize,
                    offset: offset,
                    filter: debouncedFilter,

                },
            });
            console.log("Response Data:", response.data);


            if (response.data?.result !== 0) {

                setData(response.data.data.data);

                if (response.data.data.totalRecords !== pagination.totalRecords) {
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.data.data.totalRecords,
                    }));
                }
            } else {
                setData([]);

            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                const response = await axiosObj.delete(`/api/employee/${id}`);
                alert(response.data.message);
                fetchData();
            } catch (error) {
                console.error("Error deleting employee:", error);
                alert("Failed to delete employee");
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.pageIndex, pagination.pageSize, debouncedFilter]);

    const totalPages = Math.ceil(pagination.totalRecords / pagination.pageSize);


    //===============================================================================



    const handleOpenAddDialog = () => {
        setEditingEmployee(null);
        setName("");
        setEmail("");
        setDept("");
        setPassword("");
        setConpassword("");
        setOpenAddDialog(true);
    };

    const openEditDialog = (employee) => {
        setEditingEmployee(employee);
        setName(employee.name);
        setEmail(employee.email);
        setDept(employee.dept);
        setConpassword("");
        setOpenAddDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenAddDialog(false);
        setName("");
        setEmail("");
        setDept("");
        setPassword("");
        setConpassword("");
        setEditingEmployee(null);
    };

    const handleAddOrEditEmployee = async (e) => {
        e.preventDefault();
      
        if (!editingEmployee && password !== conpassword) {
          alert("Passwords do not match!");
          return;
        }
      
        const employeeData = { name, email, dept };
        if (!editingEmployee && password) {
          employeeData.password = password;
        }
      
        try {
          let response;
          if (editingEmployee) {
            response = await axiosObj.put(
              `/api/employee/${editingEmployee.eid}`,
              employeeData,
              { validateStatus: () => true }
            );
            if (response.data?.result !== 0) {
              const updatedEmployee = { ...editingEmployee, ...employeeData };
            //   console.log("=e===",editingEmployee);
            //   console.log("====",employeeData);
              
              setData(prevData =>
                prevData.map(emp =>
                  emp.eid === updatedEmployee.eid ? updatedEmployee : emp
                )
              );
              alert(response.data.message);
              handleCloseDialog();
            } else {
              alert(response.data.message);
            }
          } else {
            response = await axiosObj.post(
              "/api/employee",
              employeeData,
              { validateStatus: () => true }
            );
            if (response.data?.result !== 0) {
              alert(response.data.message);
              handleCloseDialog();
            } else {
              alert(response.data.message);
            }
          }
        } catch (error) {
          console.error("Error in adding or editing employee:", error);
          alert(error.response?.data?.message || "Failed to save employee data!");
        }
      };
      

    const columns = useMemo(
        () => [
            {
                id: "expander",
                header: () => null,
                cell: ({ row }) => (
                    <button onClick={() => row.toggleExpanded()} className="text-gray-700 bg-transparent border-none focus:outline-none hover:text-black"   >
                        {row.getIsExpanded() ? <FaChevronDown className="text-gray-700 dark:text-white" /> : <FaChevronRight className="text-gray-700 dark:text-white" />
                        }
                    </button>
                ),
            },
            { accessorKey: "eid", header: "ID" },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "email", header: "Email" },
            { accessorKey: "dept", header: "Department" },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        manualPagination: true,
        onPaginationChange: setPagination,
        state: { pagination },
        onGlobalFilterChange: (filter) => {
            setGlobalFilter(filter);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Employee Records</h1>
                <NavLink
                    onClick={handleOpenAddDialog}
                    className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
                >
                    <PlusIcon />
                </NavLink>
            </div>

            <input
                type="text"
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => {
                    setGlobalFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, pageIndex: 0 })
                    )
                }
                }
                className="border p-2 mb-4 w-full rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />


            <table className="border-collapse border border-gray-300 w-full">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="bg-gray-200">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="border border-gray-300 p-2 cursor-pointer"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    {header.column.getIsSorted()
                                        ? header.column.getIsSorted() === "asc"
                                            ? " 🔼"
                                            : " 🔽"
                                        : ""}
                                </th>
                            ))}
                            <th className="border border-gray-300 p-2 cursor-pointer"
                            >Actions</th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>

                                <tr key={row.id} className="hover:bg-gray-100">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="border border-gray-300 p-2 text-center">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>

                                    ))}

                                    <td className="border border-gray-300 p-2 text-center flex justify-center gap-4">
                                        <FaEdit
                                            className="cursor-pointer"
                                            onClick={() => openEditDialog(row.original)}
                                            title="Edit Employee"
                                        />
                                        <FaTrashAlt
                                            className="cursor-pointer"
                                            onClick={() => handleDeleteEmployee(row.original.eid)}
                                            title="Delete Employee"
                                        />
                                    </td>
                                </tr>
                                {
                                    row.getIsExpanded() && (
                                        <tr key={`${row.id}-expanded`} className="bg-gray-50" >
                                            <td colSpan={columns.length + 1} className="p-2 text-gray-700 text-center">
                                                <strong>Created At:</strong> {new Date(row.original.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    )
                                }
                            </React.Fragment>

                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center p-4">
                                No results found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                    <button
                        onClick={() =>
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                        }
                        disabled={pagination.pageIndex === 0}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        {"<<"}
                    </button>
                    <button
                        onClick={() =>
                            setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))
                        }
                        disabled={pagination.pageIndex === 0}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        {"<"}
                    </button>
                    <button
                        onClick={() =>
                            setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))
                        }
                        disabled={pagination.pageIndex >= totalPages - 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        {">"}
                    </button>
                    <button
                        onClick={() =>
                            setPagination((prev) => ({ ...prev, pageIndex: totalPages - 1 }))
                        }
                        disabled={pagination.pageIndex >= totalPages - 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        {">>"}
                    </button>
                </div>
                <span>
                    Page {pagination.pageIndex + 1} of {totalPages}
                </span>
                <select
                    value={pagination.pageSize}
                    onChange={(e) =>
                        setPagination((prev) => ({
                            ...prev,
                            pageSize: Number(e.target.value),
                        }))
                    }
                    className="border p-2 rounded"
                >
                    {[5, 10, 20, 30, 40, 50].map((size) => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="text-sm text-gray-600 mt-2">
                Showing {data.length} of {pagination.totalRecords} rows
            </div>


            <Dialog open={openAddDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle>
                <form onSubmit={handleAddOrEditEmployee}>
                    <DialogContent dividers>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="normal"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Department"
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                            margin="normal"
                            fullWidth
                            required
                        />
                        {!editingEmployee && (
                            <>
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    margin="normal"
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    value={conpassword}
                                    onChange={(e) => setConpassword(e.target.value)}
                                    margin="normal"
                                    fullWidth
                                    required
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            {editingEmployee ? "Save Changes" : "Add Employee"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>




    );
}

export default EmployeePage;
