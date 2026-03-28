import { ModalProps } from "@/types";

export default function Modal({ children, onClose, className }: ModalProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div
                className={`relative pointer-events-auto w-[400px] max-h-[80vh] overflow-y-auto rounded-xl bg-white p-4 shadow-xl ${className ?? ""}`}
            >
                {onClose && (
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                        }}
                        className="absolute top-3 right-3 z-10 px-3 py-1 text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition"
                    >
                        X
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}   