import Link from "next/link";
import Modal from "./Modal";
import { EventDetailsModalProps } from "@/types";

const recurrenceLabels = {
    daily: "day",
    weekly: "week",
    monthly: "month",
    yearly: "year",
};

export default function EventDetailsModal({event, categories, statuses, onClose, onDelete}: EventDetailsModalProps) {
    return (
        <Modal onClose={onClose}>
            <div className="relative mb-4">
                <Link href={`/user/event/${event.id}`} className="text-xl font-semibold text-slate-800 text-center">
                    {event.title}
                </Link>
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
            {event.is_recurring && event.recurrence_frequency && (
                <>
                    <p className="text-xs text-slate-500 font-semibold uppercase">
                        Recurrence
                    </p>
                    <p className="text-slate-700 mb-2">
                        Every {event.recurrence_interval} {recurrenceLabels[event.recurrence_frequency]}
                        {event.recurrence_interval === 1 ? "" : "s"} until {event.recurrence_end_date}
                    </p>
                </>
            )}
            <p className="text-xs text-slate-500 font-semibold uppercase">
                Category
            </p>
            <p className="text-slate-700 mb-2">
                {event.category_id ? categories.find(c => c.id === event.category_id)?.name : "No category provided."}
            </p>
            <p className="text-xs text-slate-500 font-semibold uppercase">
                Status
            </p>
            <p className="text-slate-700 mb-2">
                {event.status_id ? statuses.find(s => s.id === event.status_id)?.name : "No status provided."}
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
