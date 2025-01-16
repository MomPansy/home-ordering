import { useQuery } from "@tanstack/react-query";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getGroupedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import supabase from "@/lib/supabase";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ChevronDown } from "lucide-react"; // Icon for expanding rows

export function Orders() {
    const { data, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("orders_view")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error(error.message);
                throw error;
            }
            return data;
        },
        select: (data) => {
            return data.map((row) => {
                return {
                    ...row,
                    name: row.name?.split('/')[1].split('.')[0]
                }
            })
        }
    });

    const columns = useMemo<ColumnDef<NonNullable<typeof data>[number]>[]>(
        () => [
            {
                header: "Order ID",
                accessorKey: "order_id",
                cell: ({ row }) => {
                    const orderId = row.original.order_id;
                    const isGrouped = row.getIsGrouped()
                    if (isGrouped) {
                        return (
                            <a
                                href={`/order/${orderId}`}
                            >
                                <Button size={'sm'}>
                                    View Order
                                </Button>
                            </a>
                        );
                    }
                }
            },
            {
                header: "Created At",
                accessorKey: "created_at",
                cell: ({ row }) => {
                    // Check if the row is grouped
                    const dateValue = row.original.created_at;
                    const formattedDate = new Date(dateValue!).toLocaleDateString("en-GB", {
                        timeZone: "Asia/Singapore",
                    });

                    const isGrouped = row.getIsGrouped()
                    if (isGrouped) {

                        return <span>{formattedDate}</span>;
                    }
                },
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => {
                    const status = row.original.status;
                    const isGrouped = row.getIsGrouped()
                    if (isGrouped) {
                        return (
                            <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${status === "Confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {status}
                            </span>
                        );
                    }
                }
            },
            {
                header: "Name",
                accessorKey: "name",
                cell: ({ row }) => (
                    <div>
                        {row.getValue<string>("name")}
                    </div>
                ),
            },
            {
                header: "Quantity",
                accessorKey: "quantity",
            },
            {
                header: "Order Item Id",
                accessorKey: "order_item_id",
            },
            {
                header: "Bucket Id",
                accessorKey: "bucket_id",
            },
        ],
        []
    );

    const table = useReactTable({
        data: data ?? [],
        columns,
        enableGrouping: true,
        getGroupedRowModel: getGroupedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            grouping: ["order_id"],
            columnVisibility: {
                order_item_id: false,
                bucket_id: false,
            },
        },
    });

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="p-2">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={row.getToggleExpandedHandler()} // 🔥 Entire row is clickable
                                    className={`cursor-pointer ${row.getIsExpanded() ? "bg-gray-100" : "hover:bg-gray-50"
                                        }`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {cell.getIsGrouped() ? (
                                                <div className="flex items-center gap-2">
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform ${row.getIsExpanded() ? "rotate-180" : "rotate-0"
                                                            }`}
                                                    />
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    <span className="text-gray-400">({row.subRows.length})</span>
                                                </div>
                                            ) : (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
