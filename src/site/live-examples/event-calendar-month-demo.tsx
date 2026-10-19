import { useState } from "react";
import {
  EventCalendar,
  type EventCalendarEvent,
} from "@/registry/overtrue/event-calendar";

// Fieldwork's October 2026, seen on Tuesday the 20th.
const NOW = new Date(2026, 9, 20, 10, 42);
const at = (month: number, day: number, hour = 0, minute = 0) =>
  new Date(2026, month, day, hour, minute);
const oct = (day: number, hour = 0, minute = 0) => at(9, day, hour, minute);

const events: EventCalendarEvent[] = [
  { id: "design-week", title: "Design week Lisbon", start: oct(5), end: oct(10), allDay: true, color: "chart-4", location: "Lisbon" },
  { id: "halcyon-sprint", title: "Halcyon brand sprint", start: oct(19), end: oct(22), allDay: true, color: "chart-1" },
  { id: "offsite", title: "Studio offsite", start: oct(29), end: at(10, 1), allDay: true, color: "chart-3", location: "Sintra" },
  { id: "q4-kickoff", title: "Q4 kickoff", start: oct(1, 10), end: oct(1, 11, 30), color: "chart-1" },
  { id: "orbit-pitch", title: "Orbit pitch", start: oct(2, 14), end: oct(2, 15), color: "chart-5" },
  { id: "invoice-run", title: "Invoice run", start: oct(1, 16), end: oct(1, 16, 30), color: "chart-2" },
  { id: "atlas-intro", title: "Atlas intro call", start: oct(13, 11), end: oct(13, 11, 45), color: "chart-5" },
  { id: "crit-13", title: "Design crit", start: oct(13, 15), end: oct(13, 16), color: "chart-1" },
  { id: "type-club", title: "Type club", start: oct(14, 18), end: oct(14, 19), color: "chart-4" },
  { id: "payroll", title: "Payroll", start: oct(15), end: oct(16), allDay: true, color: "chart-2" },
  { id: "photo-shoot", title: "Product shoot", start: oct(16, 9), end: oct(16, 13), color: "chart-3", location: "Studio B" },
  { id: "halcyon-review", title: "Brand review", start: oct(19, 10), end: oct(19, 11, 30), color: "chart-1" },
  { id: "atlas-crit", title: "Atlas crit", start: oct(20, 9, 30), end: oct(20, 11), color: "chart-1" },
  { id: "hiring", title: "Hiring sync", start: oct(20, 10), end: oct(20, 10, 45), color: "chart-5" },
  { id: "halcyon-handoff", title: "Halcyon handoff", start: oct(21, 10, 30), end: oct(21, 12), color: "chart-1" },
  // The busy Thursday.
  { id: "standup-22", title: "Studio standup", start: oct(22, 9), end: oct(22, 9, 20), color: "chart-2" },
  { id: "a11y", title: "Accessibility workshop", start: oct(22, 10), end: oct(22, 12), color: "chart-3" },
  { id: "paperline", title: "Vendor call: Paperline", start: oct(22, 11), end: oct(22, 11, 45), color: "chart-5" },
  { id: "orbit-review", title: "Orbit web review", start: oct(22, 14), end: oct(22, 15, 30), color: "chart-1" },
  { id: "mentoring", title: "Mentoring hour", start: oct(22, 16), end: oct(22, 17), color: "chart-4" },
  { id: "drinks", title: "Studio drinks", start: oct(22, 18), end: oct(22, 20), color: "chart-2" },
  { id: "retro", title: "Sprint retro", start: oct(23, 10), end: oct(23, 11), color: "chart-4" },
  { id: "show-tell", title: "Show and tell", start: oct(23, 15, 30), end: oct(23, 17), color: "chart-2" },
  { id: "orbit-launch", title: "Orbit launch", start: oct(27, 9), end: oct(27, 10), color: "chart-5" },
  { id: "board", title: "Board update", start: oct(28, 16), end: oct(28, 17), color: "chart-1" },
  { id: "halloween", title: "Costume crit", start: oct(31, 17), end: oct(31, 19), color: "chart-3" },
  { id: "nov-planning", title: "November planning", start: at(10, 2, 10), end: at(10, 2, 11), color: "chart-1" },
];

export default function Demo() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <EventCalendar
      events={events}
      now={NOW}
      defaultDate={NOW}
      defaultView="month"
      locale="en-US"
      weekStartsOn={1}
      selectedEventId={selected}
      onEventClick={(event) => setSelected(event.id)}
    />
  );
}
