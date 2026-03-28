"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchEventById, updateEvent } from "@/app/services/events";
import { fetchCategories } from "@/app/services/categories";
import { Category, UpdateEventData } from "@/types";

export default function EditEventPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = parseInt(params.id as string, 10);

    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<UpdateEventData>({
        title: "",
        description: "",
        scheduled_for: "",
        category_id: null,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [event, categoriesData] = await Promise.all([
                    fetchEventById(eventId),
                    fetchCategories(),
                ]);

                setCategories(categoriesData);
                setFormData({
                    title: event.title,
                    description: event.description ?? "",
                    scheduled_for: event.scheduled_for
                        ? new Date(event.scheduled_for).toISOString().slice(0, 16)
                        : "",
                    category_id: event.category_id ?? null,
                });
            } catch (error) {
                console.error("Failed to load event data:", error);
            }
        };

        loadData();
    }, [eventId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "category_id"
                    ? value === ""
                        ? null
                        : parseInt(value, 10)
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            await updateEvent(eventId, formData);
            router.push("/user");
        } catch (error) {
            console.error("Failed to update event:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight">Edit event</h1>
                    <p className="mt-3 text-slate-300">
                        Update the selected event details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <section className="space-y-6">

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <label
                                    htmlFor="title"
                                    className="text-sm font-medium text-slate-200"
                                >
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full border-b border-slate-600 bg-transparent px-0 py-3 text-white outline-none transition focus:border-white"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="description"
                                    className="text-sm font-medium text-slate-200"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full border-b border-slate-600 bg-transparent px-0 py-3 text-white outline-none transition focus:border-white resize-y"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Schedule and category</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Set when the event takes place and assign a category.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label
                                    htmlFor="scheduled_for"
                                    className="text-sm font-medium text-slate-200"
                                >
                                    Date
                                </label>
                                <input
                                    id="scheduled_for"
                                    type="datetime-local"
                                    name="scheduled_for"
                                    value={formData.scheduled_for}
                                    onChange={handleChange}
                                    className="w-full border-b border-slate-600 bg-transparent px-0 py-3 text-white outline-none transition focus:border-white"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <label
                                    htmlFor="category_id"
                                    className="text-sm font-medium text-slate-200"
                                >
                                    Category
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id ?? ""}
                                    onChange={handleChange}
                                    className="w-full border-b border-slate-600 bg-slate-900 px-0 py-3 text-white outline-none transition focus:border-white"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => router.push("/user")}
                            className="px-5 py-3 font-semibold text-white transition hover:text-slate-300 disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-3 font-semibold text-white transition hover:text-slate-300 disabled:opacity-60"
                        >
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}