"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarViewProps } from "@/types";

export default function CalendarView( {events, onDateClick}: CalendarViewProps ) {
    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            firstDay={1}
            dateClick={(info) => onDateClick(info.dateStr)}
            events={events.map((event) => ({
					id: String(event.id),
					title: event.title,
					start: event.scheduled_for,
		    }))}
        />
    )
}