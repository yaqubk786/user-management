"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

// Function to fetch paginated users from the API
const fetchUsers = async (page) => {
  const response = await fetch(`https://randomuser.me/api/?results=10&page=${page}`);
  if (!response.ok) throw new Error("Error fetching users.");
  const data = await response.json();
  const totalItems = 50; // Mock total count
  return { data: data.results, totalItems };
};

const UserTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  // Sync `pageIndex` with the query parameter
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const page = parseInt(pageParam || "1", 10) - 1; // Convert 1-based to 0-based
    setPageIndex(page);
  }, [searchParams]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", pageIndex],
    queryFn: () => fetchUsers(pageIndex + 1),
    keepPreviousData: true, // Retain previous data while fetching new data
  });

  const users = data?.data || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / 10);

  // Define table columns
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => `${info.getValue().first} ${info.getValue().last}`,
      filterFn: (row, columnId, value) => {
        const fullName = `${row.original.name.first} ${row.original.name.last}`.toLowerCase();
        return fullName.includes(value.toLowerCase());
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      filterFn: (row, columnId, value) => row.getValue(columnId).toLowerCase().includes(value.toLowerCase()),
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (info) => `${info.getValue().city}, ${info.getValue().country}`,
    },
  ];

  // React Table configuration
  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Pagination handlers
  const handleNext = () => {
    if (pageIndex < totalPages - 1) {
      router.push(`/users?page=${pageIndex + 2}`);
    }
  };

  const handlePrevious = () => {
    if (pageIndex > 0) {
      router.push(`/users?page=${pageIndex}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">User Management</h1>

      {/* Global Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200"
                  >
                    <div className="flex flex-col">
                      <span
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer hover:text-blue-500"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? " 🔼" : 
                         header.column.getIsSorted() === "desc" ? " 🔽" : null}
                      </span>
                      {header.column.getCanFilter() && (
                        <input
                          type="text"
                          value={header.column.getFilterValue() || ""}
                          onChange={(e) => header.column.setFilterValue(e.target.value)}
                          placeholder={`Filter ${header.column.columnDef.header}`}
                          className="mt-1 p-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={pageIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </span>
        <button
          onClick={handleNext}
          disabled={pageIndex >= totalPages - 1}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Wrap UserTable with Suspense
const UserTableWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading user data...</div>}>
      <UserTable />
    </Suspense>
  );
};

export default UserTableWithSuspense;
