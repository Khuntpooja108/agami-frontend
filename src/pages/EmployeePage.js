import React, { useState, useEffect, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import axiosObj from "../config/Axios";
import { Navigate, NavLink } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { useDebounce } from "use-debounce";

import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, } from 'react-router-dom';



const useDebouncedValue = (inputValue, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, delay]);

    return debouncedValue;
};

function EmployeePage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [globalFilter, setGlobalFilter] = useState("");
    const [debouncedFilter] = useDebounce(globalFilter, 500);

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

                // throw new Error("Failed to fetch");
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


    const columns = useMemo(
        () => [
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
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Employee Records</h1>
                <NavLink
                    to="/employee/new"
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


            {/* Data Table */}
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
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-100">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="border border-gray-300 p-2 text-center">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>

                                ))}

<td className="border border-gray-300 p-2 text-center flex justify-center gap-4">
                                    <FaEdit
                                        className="text-blue-500 cursor-pointer"
                                        onClick={() => navigate(`/employee/edit/${row.original.eid}`)}
                                        title="Edit Employee"
                                    />
                                    <FaTrashAlt
                                        className="text-red-500 cursor-pointer"
                                        onClick={() => handleDeleteEmployee(row.original.eid)}
                                        title="Delete Employee"
                                    />
                                </td>
                            </tr>
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

            {/* Pagination Controls */}
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
        </div>
    );
}

export default EmployeePage;
