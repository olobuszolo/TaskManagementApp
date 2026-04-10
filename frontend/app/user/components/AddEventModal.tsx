import { AddEventModalProps } from "@/types";
import Modal from "./Modal";

export default function AddEventModal({ newEvent, categories, onChange, onClose, onSubmit }: AddEventModalProps) {
    return (
        <Modal onClose={onClose}>
            <div className="relative mb-5">
                <h2 className="text-xl font-semibold text-center text-slate-600">
                New Event
                </h2>  
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                <label htmlFor="title" className="text-sm font-medium text-slate-700">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
                </div>

                <div className="flex flex-col gap-1">
                <label
                    htmlFor="description"
                    className="text-sm font-medium text-slate-700"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={onChange}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 resize-none"
                />
                </div>

                <div className="flex flex-col gap-1">
                <label
                    htmlFor="scheduled_for"
                    className="text-sm font-medium text-slate-700"
                >
                    Date
                </label>
                <input
                    id="scheduled_for"
                    type="datetime-local"
                    name="scheduled_for"
                    value={newEvent.scheduled_for}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="category_id"
                        className="text-sm font-medium text-slate-700"
                    >
                        Category
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={newEvent.category_id ?? ""}
                        onChange={onChange}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    className="mt-2 w-full rounded-lg bg-slate-800 px-4 py-2 font-medium text-white transition hover:bg-slate-700"
                    onClick={onSubmit}
                >
                    Add Event
                </button>
            </div>

        </Modal>
    )
}
