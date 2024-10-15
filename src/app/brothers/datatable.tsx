"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Brother } from "@/models/brother"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        /* getPaginationRowModel: getPaginationRowModel(), */
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    const info = [...data] as any as Brother[]

    return (
        <div className="flex flex-col gap-2" >
            <div className="flex md:items-center md:justify-between flex-col md:flex-row">
                <div className="flex flex-col text-sm ">
                    <ul className="flex md:flex-row gap-2  flex-col">
                        <li>Total de ativos:  <b> {info?.filter((x) => x.active).length}</b> </li>
                        <li>Total de inativos: <b>{info?.filter(x => !x.active).length}</b> </li>
                        <li>Total de TPL ativos: <b>{info?.filter(x => x.active_tpl).length}</b> </li>
                    </ul>
                </div>

                <Input
                    placeholder="Filtrar nomes..."
                    value={(table.getColumn("brother_name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("brother_name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-lg mt-2 md:mt-0"
                />
            </div>

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
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sem registros.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>

    )
}
