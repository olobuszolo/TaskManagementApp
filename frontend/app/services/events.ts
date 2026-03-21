import axios from "axios";
import { event } from "../../types";

export const createEvent = async (data: event) => {
	const res = await axios.post(
		"http://localhost:8000/events/events/",
		data,
		{
			withCredentials: true,
		}
	);

	return res.data;
}

export const fetchEvents = async () => {
    const res = await axios.get(
        "http://localhost:8000/events/events/",
        {
            withCredentials: true,
        }
    );

    return res.data;
}
