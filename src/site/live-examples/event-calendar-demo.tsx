import { useState } from "react";
import {
  EventCalendar,
  type EventCalendarEvent,
} from "@/registry/overtrue/event-calendar";

// Fieldwork, a small design studio, on Tuesday 20 October 2026 at 10:42.
const NOW = new Date(2026, 9, 20, 10, 42);
const at = (day: number, hour: number, minute = 0) =>
  new Date(2026, 9, day, hour, minute);

const team = {
  ines: { name: "Ines Moreau" },
  kofi: { name: "Kofi Mensah" },
  mara: { name: "Mara Lindqvist" },
  theo: { name: "Theo Park" },
  yuki: { name: "Yuki Tanaka" },
};

const standups: EventCalendarEvent[] = [19, 21, 23].map((day) => ({
  id: `standup-${day}`,
  title: "Studio standup",
  start: at(day, 9),
  end: at(day, 9, 15),
  color: "chart-2",
  location: "Studio floor",
}));

const initialEvents: EventCalendarEvent[] = [
  {
    id: "halcyon-sprint",
    title: "Halcyon brand sprint",
    start: at(19, 0),
    end: at(22, 0),
    allDay: true,
    color: "chart-1",
  },
  {
    id: "offsite",
    title: "Studio offsite prep",
    start: at(23, 0),
    end: at(24, 0),
    allDay: true,
    color: "chart-3",
  },
  ...standups,
  {
    id: "halcyon-review",
    title: "Brand review: Halcyon",
    start: at(19, 10),
    end: at(19, 11, 30),
    color: "chart-1",
    location: "Crit room",
    attendees: [team.ines, team.kofi, team.mara],
  },
  {
    id: "lunch-learn",
    title: "Lunch and learn: variable fonts",
    start: at(19, 12, 30),
    end: at(19, 13, 30),
    color: "chart-4",
    location: "Kitchen",
  },
  {
    id: "moodboards",
    title: "Mood boards",
    start: at(19, 14, 30),
    end: at(19, 16, 30),
    color: "chart-3",
    location: "Studio B",
  },
  {
    id: "orbit-call",
    title: "Client call: Orbit",
    start: at(19, 15),
    end: at(19, 16),
    color: "chart-5",
    location: "Video",
  },
  {
    id: "atlas-crit",
    title: "Design crit: Atlas app",
    start: at(20, 9, 30),
    end: at(20, 11),
    color: "chart-1",
    location: "Crit room",
    attendees: [team.theo, team.yuki, team.ines, team.kofi],
  },
  {
    id: "hiring",
    title: "Hiring sync",
    start: at(20, 14),
    end: at(20, 14, 45),
    color: "chart-5",
    location: "Video",
  },
  {
    id: "type-workshop",
    title: "Type pairing workshop",
    start: at(20, 13, 30),
    end: at(20, 15, 30),
    color: "chart-3",
    location: "Studio B",
  },
  {
    id: "portfolio",
    title: "Portfolio review",
    start: at(20, 16),
    end: at(20, 17),
    color: "chart-2",
  },
  {
    id: "halcyon-handoff",
    title: "Halcyon handoff",
    start: at(21, 10, 30),
    end: at(21, 12),
    color: "chart-1",
    location: "Crit room",
  },
  {
    id: "prototype",
    title: "Build sprint",
    start: at(21, 13),
    end: at(21, 16, 30),
    color: "chart-4",
    location: "Lab",
  },
  {
    id: "one-on-one",
    title: "1:1 with Mara",
    start: at(21, 14),
    end: at(21, 14, 30),
    color: "chart-5",
  },
  {
    id: "a11y",
    title: "Accessibility workshop",
    start: at(22, 10),
    end: at(22, 12),
    color: "chart-3",
    location: "Studio A",
  },
  {
    id: "paperline",
    title: "Vendor call: Paperline",
    start: at(22, 16),
    end: at(22, 16, 45),
    color: "chart-5",
    location: "Video",
  },
  {
    id: "orbit-review",
    title: "Design review: Orbit web",
    start: at(22, 14),
    end: at(22, 15, 30),
    color: "chart-1",
    location: "Crit room",
  },
  {
    id: "retro",
    title: "Sprint retro",
    start: at(23, 10),
    end: at(23, 11),
    color: "chart-4",
  },
  {
    id: "show-and-tell",
    title: "Show and tell",
    start: at(23, 15, 30),
    end: at(23, 17),
    color: "chart-2",
    location: "Studio floor",
  },
];

export default function Demo() {
  const [events, setEvents] = useState(initialEvents);
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <EventCalendar
      events={events}
      now={NOW}
      defaultDate={NOW}
      locale="en-US"
      weekStartsOn={1}
      hideWeekends
      selectedEventId={selected}
      onEventClick={(event) => setSelected(event.id)}
      onSlotClick={(start, end, { allDay }) => {
        const id = `new-${start.getTime()}`;
        setEvents((list) => [
          ...list,
          { id, title: "New event", start, end, allDay, color: "primary" },
        ]);
        setSelected(id);
      }}
    />
  );
}
