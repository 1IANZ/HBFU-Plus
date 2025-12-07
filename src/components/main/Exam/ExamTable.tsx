"use client";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { CalendarDays, MapPin } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ExamSchedule } from "@/utils/get_exam";

interface ExamTableProps {
	data: ExamSchedule[];
}

export function ExamTable({ data }: ExamTableProps) {
	const columns: ColumnDef<ExamSchedule>[] = [
		{
			accessorKey: "courseName",
			header: "课程名称",
		},
		{
			accessorKey: "examTime",
			header: "考试时间",
			cell: ({ row }) => (
				<div className="flex items-center gap-1">
					<CalendarDays className="w-4 h-4 text-muted-foreground" />
					<span>{row.original.examTime}</span>
				</div>
			),
		},
		{
			accessorKey: "examLocation",
			header: "考场",
			cell: ({ row }) => (
				<div className="flex items-center gap-1">
					<MapPin className="w-4 h-4 text-muted-foreground" />
					<span>{row.original.examLocation}</span>
				</div>
			),
		},
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="w-full">
			{/* 只允许横向滚动 */}
			<div className="w-full overflow-x-auto">
				<Table className="min-w-full table-auto">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="whitespace-nowrap">
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="whitespace-nowrap">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
