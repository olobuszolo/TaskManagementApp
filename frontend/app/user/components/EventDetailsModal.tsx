import Modal from "./Modal";
import { EventDetailsModalProps } from "@/types";

export default function EventDetailsModal({event, onClose, onDelete}: EventDetailsModalProps) {
    return (
        <Modal onClose={onClose}>
            <div className="relative mb-4">
                <h2 className="text-xl font-semibold text-slate-800 text-center">
                    {event.title}
                </h2>
            </div>

            <p className="text-xs text-slate-500 font-semibold uppercase">
                Description
            </p>
            <p className="text-slate-700 mb-2">
                {event.description || "No description provided."}
            </p>
            <p className="text-xs text-slate-500 font-semibold uppercase">
                Date
            </p>
            <p className="text-slate-700 mb-2">
                {event.scheduled_for || "No date provided."}
            </p>
            <p className="text-xs text-slate-500 font-semibold uppercase">
                Category
            </p>
            <p className="text-slate-700 mb-2">
                {event.category_id || "No category provided."}
            </p>
            <p className="text-xs text-slate-500 font-semibold uppercase">
                Status
            </p>
            <p className="text-slate-700 mb-2">
                {event.status || "No status provided."}
            </p>

            <button
                onClick={onDelete}
                className="mt-2 w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
            >
                Delete Event
            </button>
        </Modal>
    )
}