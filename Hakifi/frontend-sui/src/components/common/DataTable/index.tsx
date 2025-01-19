"use client";

import {
	ColumnDef,
	OnChangeFn,
	PaginationState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/utils";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import Pagination from "../Pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./Table";
import EmptyData from "../EmptyData/index";
interface DataTableProps<TData, TValue> {
	isFilter?: string[];
	columns: ColumnDef<TData>[];
	data: TData[];
	total?: number;
	currentPage?: number;
	onChangePagination?: (page: number) => void;
	onClickRow?: (data: TData) => void;
	showPagination?: boolean;
	sorting?: SortingState;
	setSorting?: OnChangeFn<SortingState>;
	styleHeader?: string;
	styleBody?: string;
	classNameWrapper?: string;
}

function DataTable<TData, TValue>({
	isFilter,
	columns,
	data,
	total,
	onChangePagination,
	onClickRow,
	showPagination = false,
	currentPage,
	sorting,
	setSorting,
	styleHeader = "",
	styleBody = "",
	classNameWrapper = "",
}: DataTableProps<TData, TValue>) {
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const pagination = useMemo(() => {
		onChangePagination && onChangePagination(pageIndex + 1);
		return {
			pageIndex,
			pageSize,
		};
	}, [pageIndex, pageSize]);
	const previousPage = () => {
		setPagination((pre) => ({ ...pre, pageIndex: pre.pageIndex - 1 }));
	};
	const nextPage = () => {
		setPagination((pre) => ({ ...pre, pageIndex: pre.pageIndex + 1 }));
	};
	const pageCount = useMemo(() => Math.ceil((total || 0) / 10), [total]);
	const noData = useMemo(() => total === 0, [total]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		pageCount,
		onPaginationChange: setPagination,
		state: {
			pagination,
			sorting,
		},
		manualPagination: !showPagination,
		manualSorting: true,
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
	});

	const handleOnClickRow = (e: MouseEvent<HTMLDivElement>, data: TData) => {
		e.preventDefault();
		e.stopPropagation();
		if (handleClick.current) {
			onClickRow && onClickRow(data);
		}
	};

	useEffect(() => {
		if (isFilter && isFilter.length > 0) table.resetPageIndex();

	}, [isFilter?.[0]]);

	const tableWrapper = useRef<HTMLDivElement>(null);
	const bodyWrapper = useRef<HTMLTableSectionElement>(null);
	const startX = useRef(0);
	const startY = useRef(0);
	const scrollLeft = useRef(0);
	const previousScrollLeft = useRef(0);
	const handleClick = useRef(true);
	const scrollTop = useRef(0);
	const mouseDown = useRef(false);
	const stopDragging = (event: any) => {
		if (bodyWrapper.current)
			bodyWrapper.current.classList.remove("cursor-grabbing");
		mouseDown.current = false;
	};

	const startDragging = (e: { pageX: number; pageY: number; }) => {
		if (bodyWrapper.current)
			bodyWrapper.current.classList.add("cursor-grabbing");
		if (!tableWrapper.current) return;
		mouseDown.current = true;
		startX.current = e.pageX - tableWrapper.current.offsetLeft;
		scrollLeft.current = previousScrollLeft.current;
		startY.current = e.pageY - tableWrapper.current.offsetTop;
		scrollTop.current = tableWrapper.current.scrollTop;
		handleClick.current = true;
	};

	const onDrag = (e: {
		pageX: number;
		pageY: number;
		preventDefault: () => void;
	}) => {
		e.preventDefault();
		if (!mouseDown.current || !tableWrapper.current) return;
		const x = e.pageX - tableWrapper.current.offsetLeft;
		const walk = x - startX.current;
		previousScrollLeft.current = scrollLeft.current - walk;
		tableWrapper.current.scrollLeft = scrollLeft.current - walk;
		const y = e.pageY - tableWrapper.current.offsetTop;
		const scrollY = y - startY.current;
		tableWrapper.current.scrollTop = scrollTop.current - scrollY;
		handleClick.current = false;
	};

	useEffect(() => {
		if (bodyWrapper.current) {
			bodyWrapper.current.addEventListener("mousemove", onDrag);
			bodyWrapper.current.addEventListener("mousedown", startDragging, false);
			bodyWrapper.current.addEventListener("mouseup", stopDragging, false);
			bodyWrapper.current.addEventListener("mouseleave", stopDragging, false);
		}
		return () => {
			if (bodyWrapper.current) {
				bodyWrapper.current.removeEventListener("mousemove", onDrag);
				bodyWrapper.current.removeEventListener(
					"mousedown",
					startDragging,
					false
				);
				bodyWrapper.current.removeEventListener("mouseup", stopDragging, false);
				bodyWrapper.current.removeEventListener(
					"mouseleave",
					stopDragging,
					false
				);
			}
		};
	}, []);

	return (
		<>
			<div
				className="overflow-auto scroll-table flex flex-col min-h-[500px]"
				ref={tableWrapper}
			>
				<Table className="rounded">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="sticky bg-background-tertiary border-b border-divider-secondary"
							>
								{headerGroup.headers.map((header, index) => {
									const heightSpan = table.getRowModel().rows?.length * 46 + 46;
									const meta: any = header.column.columnDef.meta;
									const isFixed = meta?.fixed;
									const width = meta?.width;
									const show = meta?.show === false ? false : true;
									return show ? (
										<TableHead
											key={header.id}
											className={cn(
												"!text-body-12 relative text-typo-secondary",
												isFixed &&
												"shadow-left bg-light-white sticky right-0 z-10",
												header.column.getCanSort()
													? "select-none cursor-pointer"
													: "",
												styleHeader
											)}
											onClick={header.column.getToggleSortingHandler()}
											style={{
												width: `${width}px`,
												minWidth: `${width}px`,
											}}
										>
											{isFixed && !noData ? (
												<span
													style={{ height: `${heightSpan}px`, right: 0 }}
													className="absolute top-0 w-full bg-background-tertiary shadow-fixed"
												/>
											) : null}
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									) : null;
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className="min-h-[500px]" ref={bodyWrapper}>
						{!noData ? (
							table.getRowModel().rows.map((row) => {
								return (
									<TableRow
										key={row.id}
										onClick={(e) => handleOnClickRow(e, row.original)}
										data-state={row.getIsSelected() && "selected"}
										className="relative h-17 cursor-pointer hover:bg-background-secondary text-body-12"
									>
										{row.getVisibleCells().map((cell) => {
											const meta: any = cell.column.columnDef.meta;
											const isFixed = meta?.fixed;
											const width = meta?.width;
											const show = meta?.show === false ? false : true;
											return show ? (
												<TableCell
													key={cell.id}
													// onClick={(e) =>
													// 	handleOnClickCell(
													// 		e,
													// 		meta?.onCellClick(row.original)
													// 	)
													// }
													className={cn(
														"text-typo-secondary",
														isFixed &&
														"shadow-left sticky right-0 z-3 bg-background-tertiary",
														styleBody
													)}
													style={{
														width: `${width}px`,
													}}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											) : null;
										})}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-typo-primary"
								>
									<EmptyData />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{!noData && pageCount > 1 ? (
				<Pagination
					onPreviousPage={previousPage}
					onNextPage={nextPage}
					canNextPage={table.getCanNextPage()}
					canPreviousPage={table.getCanPreviousPage()}
					pageCount={pageCount}
					pageIndex={pageIndex}
					setPageIndex={table.setPageIndex}
					className="my-4 px-4"
				/>
			) : null}
		</>
	);
}

export default DataTable;
