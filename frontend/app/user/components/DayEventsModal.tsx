import { DayEventsModalProps } from "@/types";
import Modal from "./Modal";

export default function DayEventsModal({selectedDate, events, onClose, onAddEvent, onSelectedEvent}: DayEventsModalProps) {
    return (
        <Modal onClose={onClose}>
            <div className="relative mb-3">
                <h2 className="font-semibold text-xl text-slate-900 text-center">
                    <span className="text-slate-600">{selectedDate}</span>
                </h2>                
            </div>

            {events.length === 0 ? (
                <p className="text-sm text-slate-500">No events for this day</p>                
            ): (
                <ul className="space-y-3">
                {events.map((event) => (
                    <li key={event.id} 
                    onClick = {() => {
                        onSelectedEvent(event);
                    }}
                    className="bg-slate-800 rounded-lg p-3 shadow hover:bg-slate-700 transition cursor-pointer">
                    <p className="font-semibold">{event.title}</p>
                    </li>
                ))}
                </ul>
            )}
            <button
                onClick={onAddEvent}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
            >
                Add Event
            </button>
        </Modal>
    )
}