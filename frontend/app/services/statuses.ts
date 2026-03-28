import axios from "axios";

export const fetchStatuses = async () => {
    const res = await axios.get(
        "http://localhost:8000/events/statuses/",
        {
			withCredentials: true,
		}
	);

	return res.data;
}