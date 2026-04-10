import axios from "axios";

export const fetchCurrentUser = async () => {
    const res = await axios.get(
        "http://localhost:8000/login/user-info/",
        {
            withCredentials: true,
        }
    );

    return res.data;
}
