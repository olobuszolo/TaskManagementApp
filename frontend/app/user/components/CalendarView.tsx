"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarViewProps } from "@/types";

const DEFAULT_CATEGORY_COLOR = "#2563eb";
// This component renders the calendar view using FullCalendar. It displays events with colors based on their categories and allows users to click on dates and change the visible month. It also includes a legend for event categories.
export default function CalendarView({ events, categories, onDateClick, onMonthChange }: CalendarViewProps) {
    const usedCategoryIds = new Set(
        events
            .map((event) => event.category_id)
            .filter((categoryId): categoryId is number => categoryId !== null),
    );
    const legendCategories = categories.filter((category) => usedCategoryIds.has(category.id));
    const hasUncategorizedEvents = events.some((event) => event.category_id === null);

    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
            <div className="border-b border-slate-800/80 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_36%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.72))] px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">
                    Categories
                </p>

                {(legendCategories.length > 0 || hasUncategorizedEvents) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {legendCategories.map((category) => (
                            <div
                                key={category.id}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200"
                            >
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: category.color || DEFAULT_CATEGORY_COLOR }}
                                />
                                <span>{category.name}</span>
                            </div>
                        ))}

                        {hasUncategorizedEvents && (
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: DEFAULT_CATEGORY_COLOR }}
                                />
                                <span>Uncategorized</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="calendar-shell px-3 py-4 sm:px-5 sm:py-5">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    firstDay={1}
                    displayEventTime={false}
                    fixedWeekCount={false} // Show only the weeks that have days in the current month
                    height="auto"
                    dayMaxEventRows={3}
                    timeZone="UTC"
                    headerToolbar={{ // Allows custom toolbar
                        left: "prev,next today",
                        center: "title",
                        right: "",
                    }}
                    buttonText={{
                        today: "This month",
                    }}
                    dateClick={(info) => onDateClick(info.dateStr)}
                    eventClick={(info) => onDateClick(info.event.startStr.slice(0, 10))}
                    datesSet={(info) => {
                        onMonthChange(
                            info.view.currentStart.getUTCFullYear(),
                            info.view.currentStart.getUTCMonth() + 1,
                        );
                    }}
                    events={events.map((event) => ({
                        id: String(event.id),
                        title: event.title,
                        start: event.scheduled_for,
                        color:
                            categories.find((category) => category.id === event.category_id)?.color ??
                            DEFAULT_CATEGORY_COLOR,
                    }))}
                />
            </div>
        </div>
    )
}
