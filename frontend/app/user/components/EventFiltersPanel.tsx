import { EventFiltersPanelProps } from "@/types";

// This component is used in the CalendarView and allows users to filter events by category and status. It also shows the count of filtered events vs total events for the month.

export default function EventFiltersPanel({
	categories,
	statuses,
	selectedCategoryId,
	selectedStatusId,
	filteredEventsCount,
	totalEventsCount,
	onCategoryChange,
	onStatusChange,
	onClearFilters,
}: EventFiltersPanelProps) {
	const hasActiveFilters =
		selectedCategoryId !== "all" || selectedStatusId !== "all";

	return (
		<div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/20 backdrop-blur">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div>
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
						Event filters
					</p>
					<h1 className="mt-1 text-2xl font-semibold text-white">
						Browse your calendar
					</h1>
					<p className="mt-1 text-sm text-slate-400">
						Filter visible events by category and status
					</p>
				</div>

				{hasActiveFilters && (
					<button
						type="button"
						onClick={onClearFilters}
						className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
					>
						Clear filters
					</button>
				)}
			</div>

			<div className="mt-4 grid gap-3 md:grid-cols-2">
				<div className="flex flex-col gap-2">
					<label htmlFor="event-category-filter" className="text-sm font-medium text-slate-300">
						Category
					</label>
					<select
						id="event-category-filter"
						value={selectedCategoryId}
						onChange={(e) =>
							onCategoryChange(
								e.target.value === "all" ? "all" : parseInt(e.target.value, 10),
							)
						}
						className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
					>
						<option value="all">All categories</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="event-status-filter" className="text-sm font-medium text-slate-300">
						Status
					</label>
					<select
						id="event-status-filter"
						value={selectedStatusId}
						onChange={(e) =>
							onStatusChange(
								e.target.value === "all" ? "all" : parseInt(e.target.value, 10),
							)
						}
						className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
					>
						<option value="all">All statuses</option>
						{statuses.map((status) => (
							<option key={status.id} value={status.id}>
								{status.name}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="mt-4 text-sm text-slate-400">
				Showing <span className="font-semibold text-white">{filteredEventsCount}</span> of {" "}
				<span className="font-semibold text-white">{totalEventsCount}</span> events this month
			</div>
		</div>
	);
}
