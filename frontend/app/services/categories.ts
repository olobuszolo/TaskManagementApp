import axios from "axios";

export const fetchCategories = async () => {
    const res = await axios.get(
        "http://localhost:8000/events/categories/",
        {
            withCredentials: true,
        }
    );

    return res.data;
}