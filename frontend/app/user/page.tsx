"use client";

import { useEffect, useState, useMemo } from "react";
import { event } from "../../types";
import { createEvent, fetchEvents, deleteEvent } from "../services/events";
import CalendarViewModel from "./components/CalendarView"; 
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import DayEventsModal from "./components/DayEventsModal";
import EventDetailsModal from "./components/EventDetailsModal";
import AddEventModal from "./components/AddEventModal";

export default function UserPage() {
	const [events, setEvents] = useState<event[]>([]);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [addEventModal, setAddEventModal] = useState(false);
	const [newEvent, setNewEvent] = useState({
		title: "",
		description: "",
		scheduled_for: selectedDate,
	})
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<event | null>(null);
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

		loadEvents();
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
			[name]: value
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
			setAddEventModal(false);
			setNewEvent({
				title: "",
				description: "",
				scheduled_for: "",
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
							console.log("zamykam glowny modal")
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
						onChange={handleChangeNewEvent}
						onClose={() => {
							setAddEventModal(false);
							setNewEvent({
								title: "",
								description: "",
								scheduled_for: "",
							});
						}}
						onSubmit={handleAddEvent}
					/>
				)}

				{isEventModalOpen && selectedEvent &&  (
					<EventDetailsModal
						event={selectedEvent}
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