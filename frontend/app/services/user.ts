import { api } from "@/utils/api";

export const fetchCurrentUser = async () => {
    const res = await api.get("/login/user-info/");

    return res.data;
}
