import axios from "axios";
import { event } from "../../types";

export const createEvent = async (data: event) => {
	const res = await axios.post(
		"http://localhost:8000/events/",
		data,
		{
			withCredentials: true,
		}
	);

	return res.data;
}

export const fetchEvents = async () => {
    const res = await axios.get(
        "http://localhost:8000/events/",
        {
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
