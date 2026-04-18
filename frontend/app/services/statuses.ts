import { api } from "@/utils/api";

export const fetchStatuses = async () => {
    const res = await api.get("/events/statuses/");

	return res.data;
}
