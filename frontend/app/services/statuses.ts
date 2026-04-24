import { api } from "@/utils/api";

"This module provides a function to fetch the list of event statuses from the API."

export const fetchStatuses = async () => {
    const res = await api.get("/events/statuses/");

	return res.data;
}
