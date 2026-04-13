"use client";

import {
	type ColumnDef,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type { Cocktail } from "@/lib/schemas/cocktail";
import { buildTasteFilterOptions, RATING_TABLE_DEFAULT_SORT } from "@/lib/rating-table";
import {
	getTasteProfileBadgeClassName,
	getTasteProfileLabel,
	isTasteLabelName,
} from "@/lib/taste-profile";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

const IMAGE_PLACEHOLDER = "https://cdn.eucalytics.uk/default.svg";

const columns: ColumnDef<Cocktail>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => (
			<div className="font-medium text-foreground">{row.original.name}</div>
		),
	},
	{
		accessorKey: "rating",
		header: "Rating",
		cell: ({ row }) => row.original.rating?.toFixed(1) ?? "Unrated",
		sortingFn: (left, right) => {
			const leftRating = left.original.rating ?? Number.NEGATIVE_INFINITY;
			const rightRating = right.original.rating ?? Number.NEGATIVE_INFINITY;
			return leftRating - rightRating;
		},
	},
	{
		accessorKey: "alcohol_content",
		header: "ABV",
		cell: ({ row }) => `${row.original.alcohol_content}%`,
	},
	{
		accessorKey: "taste_profile",
		header: "Taste",
		cell: ({ row }) =>
			row.original.taste_profile ? (
				<Badge className={getTasteProfileBadgeClassName(row.original.taste_profile)}>
					{getTasteProfileLabel(row.original.taste_profile)}
				</Badge>
			) : (
				<span className="text-muted-foreground">-</span>
			),
	},
	{
		accessorKey: "drink_type",
		header: "Type",
		cell: ({ row }) => row.original.drink_type?.replaceAll("_", " ") ?? "-",
	},
];

export function RatingTableView({ cocktails }: { cocktails: Cocktail[] }) {
	const [sorting, setSorting] = useState<SortingState>(RATING_TABLE_DEFAULT_SORT);
	const [globalFilter, setGlobalFilter] = useState("");
	const [tasteFilter, setTasteFilter] = useState<string>("all");

	const filteredCocktails = useMemo(() => {
		return cocktails.filter((cocktail) => {
			if (
				tasteFilter !== "all" &&
				(cocktail.taste_profile === null || cocktail.taste_profile !== tasteFilter)
			) {
				return false;
			}

			return true;
		});
	}, [cocktails, tasteFilter]);

	const table = useReactTable({
		data: filteredCocktails,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: (row, _columnId, filterValue) =>
			row.original.name.toLowerCase().includes(String(filterValue).toLowerCase()),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const tasteOptions = buildTasteFilterOptions(cocktails);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 md:flex-row md:items-center">
				<Input
					value={globalFilter}
					onChange={(event) => setGlobalFilter(event.target.value)}
					placeholder="Search cocktails"
					className="max-w-md"
				/>
				<select
					value={tasteFilter}
					onChange={(event) => setTasteFilter(event.target.value)}
					className="h-9 rounded-3xl border border-border bg-background px-3 text-sm"
				>
					<option value="all">All tastes</option>
					{tasteOptions.map((option) => (
						<option key={option} value={option}>
							{getTasteProfileLabel(option)}
						</option>
					))}
				</select>
			</div>

			<div className="overflow-hidden rounded-4xl border border-border bg-card">
				<table className="w-full border-collapse text-left text-sm">
					<thead className="bg-muted/40">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} className="px-4 py-3 font-medium text-muted-foreground">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											  )}
									</th>
								))}
								<th className="px-4 py-3 font-medium text-muted-foreground">Details</th>
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="border-border border-t align-top">
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-4 py-3">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
								<td className="px-4 py-3">
									<RatingDetailsSheet cocktail={row.original} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function RatingDetailsSheet({ cocktail }: { cocktail: Cocktail }) {
	const thumbnail = cocktail.images.find((image) => image.is_thumbnail);
	const ingredientLabels = cocktail.labels.filter(
		(label) => !isTasteLabelName(label.name),
	);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="sm">
					Details
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="overflow-y-auto sm:max-w-lg">
				<SheetHeader>
					<SheetTitle>{cocktail.name}</SheetTitle>
					<SheetDescription>{cocktail.description}</SheetDescription>
				</SheetHeader>
				<div className="space-y-4 px-6 pb-6">
					<div className="overflow-hidden rounded-3xl bg-muted">
						<img
							src={thumbnail?.image_url ?? IMAGE_PLACEHOLDER}
							alt={cocktail.name}
							className="aspect-[4/3] w-full object-cover"
						/>
					</div>
					<div className="grid gap-2 text-sm">
						<div>
							<span className="font-medium">Rating:</span>{" "}
							{cocktail.rating?.toFixed(1) ?? "Unrated"}
						</div>
						<div>
							<span className="font-medium">ABV:</span> {cocktail.alcohol_content}%
						</div>
						<div>
							<span className="font-medium">Type:</span>{" "}
							{cocktail.drink_type?.replaceAll("_", " ") ?? "-"}
						</div>
						{cocktail.taste_profile && (
							<div className="flex items-center gap-2">
								<span className="font-medium">Taste:</span>
								<Badge className={getTasteProfileBadgeClassName(cocktail.taste_profile)}>
									{getTasteProfileLabel(cocktail.taste_profile)}
								</Badge>
							</div>
						)}
					</div>
					{ingredientLabels.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{ingredientLabels.map((label) => (
								<Badge key={label.id} variant="secondary">
									{label.name}
								</Badge>
							))}
						</div>
					)}
					{cocktail.recipe && (
						<div className="rounded-3xl bg-muted/50 p-4 text-sm whitespace-pre-line text-muted-foreground">
							{cocktail.recipe}
						</div>
					)}
					<Button asChild className="w-full">
						<a href={`/cocktails/${cocktail.id}`}>Open cocktail page</a>
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
