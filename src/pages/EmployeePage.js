import React, { useState, useMemo, useEffect } from "react";
import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import axiosObj from "../config/Axios";
import { NavLink } from "react-router-dom";

import { PlusIcon } from "lucide-react";

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosObj.get("/api/employees", { validateStatus: () => true })
                console.log(response.data);

                if (response.data?.result !== 0) {

                    setData(response.data.data);
                } else {
                    throw new Error("Failed to fetch");

                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: { pagination, globalFilter },
        onGlobalFilterChange: (filter) => {
            setGlobalFilter(filter);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
    });

    console.log(table);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Employee Records</h1>
                <NavLink to="/employee/new" className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600">
                    {/* ➕  */}
                    <PlusIcon/>
                    {/* Add Employee */}
                </NavLink>

            </div>

            <input
                type="text"
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => {
                    setGlobalFilter(e.target.value);
                    table.setPageIndex(0);
                }}
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
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() ? (header.column.getIsSorted() === "asc" ? " 🔼" : " 🔽") : ""}
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

            <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        {"<<"}
                    </button>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        {"<"}
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        {">"}
                    </button>
                    <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        {">>"}
                    </button>
                </div>
                <span>
                    Page {pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <select
                    value={pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="border p-2 rounded-md"
                >
                    {[5, 10, 20, 30, 40, 50].map((size) => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="text-sm text-gray-600 mt-2">
                Showing {table.getRowModel().rows.length} of {table.getPrePaginationRowModel().rows.length} rows
            </div>
        </div>
    );
}

export default App;
