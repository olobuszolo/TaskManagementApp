import Modal from "./Modal";
import { ConfirmDeleteModalProps } from "@/types";

export default function ConfirmDeleteModal({title, onCancel, onConfirm}: ConfirmDeleteModalProps) {
    return (
        <Modal>
            <h2 className="text-xl font-semibold text-slate-800 text-center">
                Delete {title}?
            </h2>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="w-1/2 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="w-1/2 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                    Delete
                </button>
            </div>
        </Modal>
    )
}