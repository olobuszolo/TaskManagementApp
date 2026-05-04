import { CreateStatusPayload } from "@/types";
import { api } from "@/utils/api";

"This module provides functions to fetch and create event statuses."

export const fetchStatuses = async () => {
    const res = await api.get("/events/statuses/");

	return res.data;
}

export const createStatus = async (data: CreateStatusPayload) => {
    const res = await api.post("/events/statuses/", data);

    return res.data;
}
