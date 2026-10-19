export default {
  name: "event-calendar",
  title: "Event calendar",
  category: "Tables & lists",
  description:
    "A scheduling calendar with a week time grid, a month grid with overflow popovers, and a grouped agenda, built on Intl with no date library.",
  dependencies: [],
  imports: "EventCalendar, type EventCalendarEvent",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const [events, setEvents] = useState<EventCalendarEvent[]>([
    {
      id: "crit",
      title: "Design crit: Atlas app",
      start: new Date(2026, 9, 20, 9, 30),
      end: new Date(2026, 9, 20, 11),
      color: "chart-1",
      location: "Crit room",
    },
    {
      id: "sprint",
      title: "Halcyon brand sprint",
      start: new Date(2026, 9, 19),
      end: new Date(2026, 9, 22),
      allDay: true,
      color: "chart-4",
    },
  ])
  return (
    <EventCalendar
      events={events}
      defaultDate={new Date(2026, 9, 20)}
      weekStartsOn={1}
      onEventClick={(event) => console.log(event.id)}
      onSlotClick={(start, end, { allDay }) =>
        setEvents((list) => [
          ...list,
          { id: crypto.randomUUID(), title: "New event", start, end, allDay },
        ])
      }
    />
  )
}`,
  notes:
    "Times are local wall-clock times: events are plain Dates, ranges never shift across daylight-saving changes, and dates, weekdays, hours, and ranges come from Intl in `locale`, with the first weekday taken from the locale unless `weekStartsOn` is set. Events of 24 hours or longer and `allDay` events sit in the all-day lane and span the month grid; an all-day end at midnight is exclusive, so a three-day sprint ends at midnight on the fourth day. Overlapping timed events share their slot side by side and widen into free columns. The week view scrolls to working hours on mount, shades time outside them, draws the current time across today, and keeps the days and all-day lane pinned while the hours scroll; below `minDayWidth` per day it scrolls sideways with the hour gutter pinned. Clicking empty time offers a `slotMinutes` slot, and dragging selects a range snapped to `snapMinutes`; both arrive through `onSlotClick`, as do clicks on the all-day lane, an empty month cell, or a week day header. From the keyboard the focused day is one tab stop: arrows move between days (and across weeks and months), Page Up and Page Down jump a week or month, Home and End go to the week's edges, Tab enters that day's events, arrows walk them, and Escape returns to the day. In the month view Enter on a date opens its week. Pass `onRangeChange` to fetch events for the visible range and `loading` while they arrive.",
  previewWidth: 760,
  examples: [
    {
      name: "event-calendar-demo",
      title: "Studio week",
      description:
        "A design studio's working week with reviews, workshops, and a few overlaps. Click empty time or drag across it to add an event, click an event to select it, and switch to month or agenda.",
    },
    {
      name: "event-calendar-month-demo",
      title: "Month at a glance",
      description:
        "October in the month view. Multi-day events span the grid, and the busy Thursday collapses into +3 more; open it to see the whole day.",
    },
  ],
  api: [
    [
      "events",
      "EventCalendarEvent[]",
      "{ id; title; start: Date; end: Date; allDay?; color?; location?; attendees?: { name; image? }[] }.",
    ],
    [
      "view? / defaultView? / onViewChange?",
      '"week" | "month" | "agenda"',
      "Controlled or initial view. Defaults to week.",
    ],
    ["views?", "EventCalendarView[]", "Views offered by the switcher, in order. One view hides the switcher."],
    [
      "date? / defaultDate? / onDateChange?",
      "Date / (date: Date) => void",
      "The focused day. The visible week or month is the one that contains it; agenda starts on it. Defaults to today.",
    ],
    [
      "onRangeChange?",
      "(range: { start; end }, view) => void",
      "Called with the visible range, end exclusive, on mount and when it changes. Also exported: getVisibleRange(view, date, options).",
    ],
    [
      "color (per event)",
      '"chart-1" … "chart-5" | "primary" | "muted" | string',
      "A theme series or any CSS color. It tints the chip and fills the inset accent.",
    ],
    [
      "onEventClick?",
      "(event, { view, element }) => void",
      "Called when an event is activated, with the chip element for anchoring a popover.",
    ],
    [
      "onSlotClick?",
      "(start, end, { allDay; source }) => void",
      'Called for a click on empty time, a drag selection, an all-day or month cell, or a day picked from the keyboard. source is "click", "drag", or "keyboard".',
    ],
    ["selectable?", "boolean", "Drag across the time grid to select a range. Defaults to true when onSlotClick is set."],
    [
      "selectedEventId?",
      "string | null",
      "Highlights an event. Leave undefined to highlight the last clicked one.",
    ],
    [
      "renderEvent?",
      "(event, info) => ReactNode",
      "Replaces chip contents. info has view, start, end, color, timeLabel, compact, allDay, and selected. The chip keeps its accessible name.",
    ],
    ["now?", "Date", "Anchors today and the time line. Defaults to the clock, updated each minute."],
    ["locale?", "string", "BCP 47 locale for dates, weekdays, hours, and ranges."],
    ["weekStartsOn?", "0 | 1 | 2 | 3 | 4 | 5 | 6", "First day of the week, 0 for Sunday. Defaults to the locale's."],
    ["hideWeekends?", "boolean", "Drop Saturday and Sunday from the week and month grids."],
    [
      "startHour? / endHour?",
      "number",
      "Hours shown by the time grid. Defaults to 0 and 24.",
    ],
    [
      "workingHours?",
      "{ start; end; days? } | null",
      "Shades time outside these hours and sets the initial scroll. Defaults to 9 to 17, Monday to Friday.",
    ],
    ["scrollToHour?", "number", "Hour at the top of the week grid on mount. Defaults to the start of working hours."],
    ["hourHeight?", "number", "Height of an hour in px. Defaults to 48."],
    ["minDayWidth?", "number", "Narrowest day column before the week scrolls sideways, in px. Defaults to 56."],
    [
      "slotMinutes? / snapMinutes?",
      "number",
      "Length of a clicked slot and the drag granularity. Default 30 and 15.",
    ],
    ["maxEventsPerDay?", "number", "Events per month cell before +N more. Defaults to 3."],
    ["agendaDays?", "number", "Days the agenda covers from date. Defaults to 14."],
    [
      "height?",
      "number | string",
      "Calendar height. Defaults to 640 for week and agenda; the month grows to fit.",
    ],
    ["formatTime?", "(date: Date) => string", "Formats times of day. Defaults to Intl hours and minutes."],
    ["loading?", "boolean", "Shows a progress line under the header and marks the grid busy."],
    ["actions?", "ReactNode", "Extra header controls, such as a New event button."],
    [
      "labels?",
      "Partial<EventCalendarLabels>",
      "Interface copy for translation, including more: (count) => string.",
    ],
  ],
} as const;
