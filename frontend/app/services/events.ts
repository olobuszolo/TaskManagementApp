import axios from "axios";
import { Event, UpdateEventData } from "../../types";

export const createEvent = async (data: Event) => {
	const res = await axios.post(
		"http://localhost:8000/events/",
		data,
		{
			withCredentials: true,
		}
	);

	return res.data;
}

export const fetchEvents = async (year?: number, month?: number) => {
    const res = await axios.get(
        "http://localhost:8000/events/",
        {
            params: {
                year,
                month,
            },
            withCredentials: true,
        }
    );

    return res.data;
}

export const deleteEvent = async (id: number) => {
	const res = await axios.delete(
		`http://localhost:8000/events/${id}/`,
		{
			withCredentials: true,
		}
	);

	return res.data;
}

export const fetchEventById = async (id: number) => {
	const res = await axios.get(
		`http://localhost:8000/events/${id}/`,
		{
			withCredentials: true,
		}
	);

	return res.data;
}

export const updateEvent = async (id: number, data: UpdateEventData) => {
	const res = await axios.patch(
		`http://localhost:8000/events/${id}/`,
		data,
		{
			withCredentials: true,
		}
	);

	return res.data;

}
