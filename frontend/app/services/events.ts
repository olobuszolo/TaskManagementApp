import { Event, UpdateEventData } from "../../types";
import { api } from "@/utils/api";

"This module provides functions to interact with the events API endpoints, including creating, fetching, updating, and deleting events."

export const createEvent = async (data: Event) => {
	const res = await api.post("/events/", data);

	return res.data;
}

export const fetchEvents = async (year?: number, month?: number) => {
    const res = await api.get(
        "/events/",
        {
            params: {
                year,
                month,
            },
        }
    );

    return res.data;
}

export const deleteEvent = async (id: number) => {
	const res = await api.delete(`/events/${id}/`);

	return res.data;
}

export const fetchEventById = async (id: number) => {
	const res = await api.get(`/events/${id}/`);

	return res.data;
}

export const updateEvent = async (id: number, data: UpdateEventData) => {
	const res = await api.patch(`/events/${id}/`, data);

	return res.data;

}
