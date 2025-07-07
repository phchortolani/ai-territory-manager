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
import { useIsMobile } from "@/utils/useMobile"

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
    const isMobile = useIsMobile()

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
        <div className="grid grid-cols-1 space-y-4" >
            <div className="flex md:items-center md:justify-between flex-col md:flex-row">
                <div className="flex flex-col text-sm ">
                    <ul className="flex md:flex-row gap-2  flex-col">
                        <li>Total de ativos:  <b> {info?.filter((x) => x.active).length}</b> </li>
                        <li>Total de inativos: <b>{info?.filter(x => !x.active).length}</b> </li>
                        <li>Total de TPL ativos: <b>{info?.filter(x => x.active_tpl).length}</b> </li>
                    </ul>
                </div>
                <Input placeholder="Filtrar nomes..." value={(table.getColumn("brother_name")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("brother_name")?.setFilterValue(event.target.value)} className="max-w-lg mt-2 md:mt-0" />
            </div>
            <div className="rounded-md border">
                <div className="rounded-md border">
                    {
                        isMobile ?
                            <div className="md:hidden space-y-4 p-2">
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <div key={row.id} className="border rounded-lg p-4 shadow-sm bg-white">
                                            {row.getVisibleCells().map((cell) => (
                                                <div key={cell.id} className="grid space-y-2 py-1 border-b last:border-b-0 text-sm">
                                                    <span className="font-medium text-gray-600">
                                                        {flexRender(cell?.column?.columnDef?.header as string, cell.getContext())}
                                                    </span>
                                                    <span className=" text-gray-800">
                                                        {flexRender(cell?.column?.columnDef?.cell, cell.getContext())}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-sm text-gray-600 py-6">Sem registros.</div>
                                )}
                            </div>
                            :
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                    }
                </div>

            </div>
        </div >

    )
}
