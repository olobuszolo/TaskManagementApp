"use client";
import axios from "axios";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState, useMemo } from "react";
import { event } from "../../types";
import { createEvent, fetchEvents } from "../services/events";

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

	return (
		<div className="min-h-screen bg-slate-900 text-white">
			<div className="relative max-w-4xl mx-auto p-4">
				<FullCalendar
					plugins={[dayGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					firstDay={1}
					dateClick={(info) => {
						setSelectedDate(info.dateStr);
						setIsModalOpen(true);
						setNewEvent((prev) => ({
							...prev,
							scheduled_for: getRoundedDateTime(info.dateStr),
						}))
					}}
					events={events.map((event) => ({
					id: String(event.id),
					title: event.title,
					start: event.scheduled_for,
					}))}
				/>
				{isModalOpen && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="w-[400px] max-h-[80%] overflow-y-auto rounded-xl bg-white p-4 shadow-xl">
					
					<div className="relative mb-3">
						<h2 className="font-semibold text-xl text-slate-900 text-center">
							<span className="text-slate-600">{selectedDate}</span>
						</h2>
						<button
							onClick={() => setIsModalOpen(false)}
							  className="absolute top-0 right-0 px-3 py-1 text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition"
						>
						X
						</button>
					</div>

					{selectedDayEvents.length === 0 ? (
						<p className="text-sm text-slate-500">No events for this day</p>
					) : (
						<ul className="space-y-3">
						{selectedDayEvents.map((event) => (
							<li key={event.id} className="bg-slate-800 rounded-lg p-3 shadow hover:bg-slate-700 transition cursor-pointer">
							<p className="font-semibold">{event.title}</p>
							</li>
						))}
						</ul>
					)}
					<button
						onClick={() => setAddEventModal(true)}
						className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
					>
						Add Event
					</button>
					{addEventModal && (
					<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
						<div className="w-[400px] max-h-[80%] overflow-y-auto rounded-xl bg-white p-4 shadow-xl">
						<div className="relative mb-5">
							<h2 className="text-xl font-semibold text-center text-slate-600">
							New Event
							</h2>
							<button
							onClick={() => {
								setAddEventModal(false)
								setNewEvent({
									title: "",
									description: "",
									scheduled_for: "",
								})
							}}
							className="absolute top-0 right-0 px-3 py-1 text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition"
							>
							X
							</button>
						</div>

						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1">
							<label htmlFor="title" className="text-sm font-medium text-slate-700">
								Title
							</label>
							<input
								id="title"
								type="text"
								name="title"
								value={newEvent.title}
								onChange={handleChangeNewEvent}
								className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							/>
							</div>

							<div className="flex flex-col gap-1">
							<label
								htmlFor="description"
								className="text-sm font-medium text-slate-700"
							>
								Description
							</label>
							<textarea
								id="description"
								name="description"
								value={newEvent.description}
								onChange={handleChangeNewEvent}
								rows={4}
								className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 resize-none"
							/>
							</div>

							<div className="flex flex-col gap-1">
							<label
								htmlFor="scheduled_for"
								className="text-sm font-medium text-slate-700"
							>
								Date
							</label>
							<input
								id="scheduled_for"
								type="datetime-local"
								name="scheduled_for"
								value={newEvent.scheduled_for}
								onChange={handleChangeNewEvent}
								className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							/>
							</div>

							<button
							type="button"
							className="mt-2 w-full rounded-lg bg-slate-800 px-4 py-2 font-medium text-white transition hover:bg-slate-700"
							onClick={handleAddEvent}
							>
							Add Event
							</button>
						</div>
						</div>
					</div>
					)}
					
					</div>
				</div>
				)}

			</div>
		</div>
	);
}