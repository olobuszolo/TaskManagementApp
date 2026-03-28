"use client";

import { useEffect, useState, useMemo } from "react";
import { Category, Event, Status } from "../../types";
import { createEvent, fetchEvents, deleteEvent } from "../services/events";
import CalendarViewModel from "./components/CalendarView"; 
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import DayEventsModal from "./components/DayEventsModal";
import EventDetailsModal from "./components/EventDetailsModal";
import AddEventModal from "./components/AddEventModal";
import { fetchCategories } from "../services/categories";
import { fetchStatuses } from "../services/statuses";

export default function UserPage() {
	const [events, setEvents] = useState<Event[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [statuses, setStatuses] = useState<Status[]>([]);
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

	useEffect(() => {
		const loadEvents = async () => {
			try {
				const data = await fetchEvents();
				setEvents(data);
			} catch (err) {
				console.error(err);
			}
		};

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

		loadEvents();
		loadCategories();
		loadStatuses();
	}, []);

	const selectedDayEvents = useMemo(() => {
		if (!selectedDate) return [];
		return events.filter(event => {
			return event.scheduled_for.slice(0, 10) === selectedDate
		})
	}, [events, selectedDate]);

	const handleChangeNewEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const { name, value } = e.target;
		setNewEvent((prev) => ({
			...prev,
			[name]: name === "category_id" ? (value ? parseInt(value) : null) : value,
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

			const data = await fetchEvents();
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
			const data = await fetchEvents();
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

	return (
		<div className="min-h-screen bg-slate-900 text-white">
			<div className="relative max-w-4xl mx-auto p-4">
				<CalendarViewModel 
					events={events}
					onDateClick={handleDateClick}
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