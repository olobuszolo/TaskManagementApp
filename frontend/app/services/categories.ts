import { CreateCategoryPayload, UpdateCategoryPayload } from "@/types";
import { api } from "@/utils/api";

"This module provides functions to interact with the categories API endpoints, including fetching all categories, creating a new category, and updating an existing category."

export const fetchCategories = async () => {
    const res = await api.get("/events/categories/");

    return res.data;
}

export const createCategory = async (data: CreateCategoryPayload) => {
    const res = await api.post("/events/categories/", data);

    return res.data;
}

export const updateCategory = async (id: number, data: UpdateCategoryPayload) => {
    const res = await api.patch(`/events/categories/${id}/`, data);

    return res.data;
}
