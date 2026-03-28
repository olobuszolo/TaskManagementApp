import { PropsWithChildren } from "react";
export type Event = {
    id: number;
    title: string;
    description: string | null;
    scheduled_for: string;
    creator_id: number;
    category_id: number | null;
    status_id: number | null;
    group_id: number | null;
}

export type Category = {
    id: number;
    name: string;
}

export type Status = {
    id: number;
    code: string;
    name: string;
    color: string;
}

export type ModalProps = PropsWithChildren<{
	onClose?: () => void;
	className?: string;
}>;

export type CalendarViewProps = {
    events: Event[];
    onDateClick: (dateStr: string) => void;
}

export type ConfirmDeleteModalProps = {
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export type DayEventsModalProps = {
    selectedDate: string;
    events: Event[];
    onClose: () => void;
    onAddEvent: () => void;
    onSelectedEvent: (event: Event) => void;
}

type NewEventType = {
    title: string;
    description: string;
    scheduled_for: string | null;
    category_id: number | null;
    status_id: number | null;
}

export type AddEventModalProps = {
    newEvent: NewEventType;
    categories: Category[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onClose: () => void;
    onSubmit: () => void;
}

export type EventDetailsModalProps = {
    event: Event;
    categories: Category[];
    statuses: Status[];
    onClose: () => void;
    onDelete: () => void;
}

export type EditEventProps = {
    formData: NewEventType;
    categories: Category[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    submitLabel: string;
}

export type UpdateEventData = {
    title: string, 
    description: string,
    scheduled_for: string
    category_id: number | null;
    status_id: number | null;
}