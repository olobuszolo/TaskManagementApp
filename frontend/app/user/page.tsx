"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Category, Event, Status } from "../../types";
import { createEvent, fetchEvents, deleteEvent } from "../services/events";
import CalendarViewModel from "./components/CalendarView"; 
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import DayEventsModal from "./components/DayEventsModal";
import EventDetailsModal from "./components/EventDetailsModal";
import AddEventModal from "./components/AddEventModal";
import EventFiltersPanel from "./components/EventFiltersPanel";
import { fetchCategories } from "../services/categories";
import { fetchStatuses } from "../services/statuses";
import { logoutUser } from "@/utils/auth";

const getCurrentVisibleMonth = () => {
	const now = new Date();
	return {
		year: now.getUTCFullYear(),
		month: now.getUTCMonth() + 1, // JS months are 0-indexed
	};
};

export default function UserPage() {
	const router = useRouter();
	const [events, setEvents] = useState<Event[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [statuses, setStatuses] = useState<Status[]>([]);
	const [visibleMonth, setVisibleMonth] = useState(getCurrentVisibleMonth);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
	const [selectedStatusId, setSelectedStatusId] = useState<number | "all">("all");
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [addEventModal, setAddEventModal] = useState(false);
	const [newEvent, setNewEvent] = useState({
		title: "",
		description: "",
		scheduled_for: selectedDate,
		category_id: null,
		status_id: null,
	})
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const data = await fetchCategories();
				setCategories(data);
			}
			catch (err) {
				console.error(err);
			}
		}

		const loadStatuses = async () => {
			try {
				const data = await fetchStatuses();
				setStatuses(data);
			}
			catch (err) {
				console.error(err);
			}
		}

		loadCategories();
		loadStatuses();
	}, []);

	useEffect(() => {
		const loadEvents = async () => {
			try {
				const data = await fetchEvents(visibleMonth.year, visibleMonth.month);
				setEvents(data);
			} catch (err) {
				console.error(err);
			}
		};

		loadEvents();
	}, [visibleMonth]);

	const filteredEvents = useMemo(() => {
		return events.filter((event) => {
			const matchesCategory =
				selectedCategoryId === "all" || event.category_id === selectedCategoryId;
			const matchesStatus =
				selectedStatusId === "all" || event.status_id === selectedStatusId;

			return matchesCategory && matchesStatus;
		});
	}, [events, selectedCategoryId, selectedStatusId]);

	const selectedDayEvents = useMemo(() => {
		if (!selectedDate) return [];
		return filteredEvents.filter(event => {
			return event.scheduled_for.slice(0, 10) === selectedDate
		})
	}, [filteredEvents, selectedDate]);

	const handleChangeNewEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
		const { name, value } = e.target;
		setNewEvent((prev) => ({
			...prev,
			[name]: name === "category_id" || name === "status_id" ? (value ? parseInt(value) : null) : value,
		}))
	}

	const getRoundedDateTime = (date: string) => {
		const now = new Date();
		let hours = now.getHours();
		let minutes = now.getMinutes();

		minutes = Math.ceil(minutes / 5) * 5;

		if (minutes === 60) {
			minutes = 0;
			hours += 1;
		}

		const hh = String(hours).padStart(2, "0");
		const mm = String(minutes).padStart(2, "0");

		return `${date}T${hh}:${mm}`;
	};

	const handleAddEvent = async () => {
		try {
			await createEvent(newEvent);

			const data = await fetchEvents(visibleMonth.year, visibleMonth.month);
			setEvents(data);

			setAddEventModal(false);
			setNewEvent({
				title: "",
				description: "",
				scheduled_for: "",
				category_id: null,
				status_id: null,
			});
		} catch (error) {
			console.error("Error adding event:", error);
		}
	};

	const handleDeleteEvent = async (id: number) => {
		try {
			await deleteEvent(id);
			const data = await fetchEvents(visibleMonth.year, visibleMonth.month);
			setEvents(data);
			setDeleteModalOpen(false);
			setIsEventModalOpen(false);
			setSelectedEvent(null);
		} catch (error) {
			console.error("Error deleting event:", error);
		}
	}

	const handleDateClick = (dateStr: string) => {
		setSelectedDate(dateStr);
		setIsModalOpen(true);
		setNewEvent((prev) => ({
			...prev,
			scheduled_for: getRoundedDateTime(dateStr),
		}))
	}

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await logoutUser();
			router.push("/");
		} catch (error) {
			console.error("Logout failed:", error);
			setIsLoggingOut(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 text-white">
			<div className="relative max-w-4xl mx-auto p-4">
				<div className="mb-4 flex justify-end gap-3">
					<Link
						href="/user/info"
						className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
					>
						User info
					</Link>
					<button
						type="button"
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="inline-flex items-center justify-center rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isLoggingOut ? "Logging out..." : "Logout"}
					</button>
				</div>

				<EventFiltersPanel
					categories={categories}
					statuses={statuses}
					selectedCategoryId={selectedCategoryId}
					selectedStatusId={selectedStatusId}
					filteredEventsCount={filteredEvents.length}
					totalEventsCount={events.length}
					onCategoryChange={setSelectedCategoryId}
					onStatusChange={setSelectedStatusId}
					onClearFilters={() => {
						setSelectedCategoryId("all");
						setSelectedStatusId("all");
					}}
				/>

				<CalendarViewModel 
					events={filteredEvents}
					categories={categories}
					onDateClick={handleDateClick}
					onMonthChange={(year, month) => {
						setVisibleMonth((current) => {
							if (current.year === year && current.month === month) {
								return current;
							}
							return { year, month };
						});
					}}
				/>

				{isModalOpen && selectedDate && (
					<DayEventsModal
						selectedDate={selectedDate}
						events={selectedDayEvents}
						onClose={() => {
							setIsModalOpen(false)}}
						onAddEvent={() => setAddEventModal(true)}
						onSelectedEvent={(event) => {
							setSelectedEvent(event);
							setIsEventModalOpen(true);
						}}
					/>
				)}

				{addEventModal && (
					<AddEventModal
						newEvent={newEvent}
						categories={categories}
						onChange={handleChangeNewEvent}
						onClose={() => {
							setAddEventModal(false);
							setNewEvent({
								title: "",
								description: "",
								scheduled_for: "",
								category_id: null,
								status_id: null,
							});
						}}
						onSubmit={handleAddEvent}
					/>
				)}

				{isEventModalOpen && selectedEvent &&  (
					<EventDetailsModal
						event={selectedEvent}
						categories={categories}
						statuses={statuses}
						onClose={() => {
							setIsEventModalOpen(false);
							setSelectedEvent(null);
						}}
						onDelete={() => setDeleteModalOpen(true)}
					/>
				)}

				{deleteModalOpen && selectedEvent && (
					<ConfirmDeleteModal
						title={selectedEvent.title}
						onCancel={() => setDeleteModalOpen(false)}
						onConfirm={() => handleDeleteEvent(selectedEvent.id)}
					/>
				)}

			</div>
		</div>
	);
}
