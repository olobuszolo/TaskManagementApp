import { PropsWithChildren } from "react";
export type event = {
    id: number;
    title: string;
    description: string | null;
    scheduled_for: string;
    creator_id: number;
    category_id: number | null;
    status: string;
    group_id: number | null;
}

export type ModalProps = PropsWithChildren<{
	onClose?: () => void;
	className?: string;
}>;

export type CalendarViewProps = {
    events: event[];
    onDateClick: (dateStr: string) => void;
}

export type ConfirmDeleteModalProps = {
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export type DayEventsModalProps = {
    selectedDate: string;
    events: event[];
    onClose: () => void;
    onAddEvent: () => void;
    onSelectedEvent: (event: event) => void;
}

type NewEventType = {
    title: string;
    description: string;
    scheduled_for: string | null;
}

export type AddEventModalProps = {
    newEvent: NewEventType;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onClose: () => void;
    onSubmit: () => void;
}

export type EventDetailsModalProps = {
    event: event;
    onClose: () => void;
    onDelete: () => void;
}