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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-end">
                    <NavLink to="/employee/new">
                    <div className="w-14 bg-gray-300 p-4 border border-gray-600 text-right">

                    ➕
                    </div>

                    </NavLink>
                    
            </div>
            <h1 className="text-xl font-bold mb-4">Employee Table</h1>

            <input
                type="text"
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => {
                    setGlobalFilter(e.target.value);
                    table.setPageIndex(0);
                }}
                className="border p-2 mb-4 w-full"
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

            <div className="flex items-center gap-2 mt-4">
                <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                    {"<<"}
                </button>
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    {"<"}
                </button>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    {">"}
                </button>
                <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                    {">>"}
                </button>
                <span>
                    Page {pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <select
                    value={pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 20, 30, 40, 50].map((size) => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                Showing {table.getRowModel().rows.length} of {table.getPrePaginationRowModel().rows.length} rows
            </div>
        </div>
    );
}

export default App;
