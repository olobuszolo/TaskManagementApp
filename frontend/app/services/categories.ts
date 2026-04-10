import { CreateCategoryPayload, UpdateCategoryPayload } from "@/types";
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

export const createCategory = async (data: CreateCategoryPayload) => {
    const res = await axios.post(
        "http://localhost:8000/events/categories/",
        data,
        {
            withCredentials: true,
        }
    );

    return res.data;
}

export const updateCategory = async (id: number, data: UpdateCategoryPayload) => {
    const res = await axios.patch(
        `http://localhost:8000/events/categories/${id}/`,
        data,
        {
            withCredentials: true,
        }
    );

    return res.data;
}
