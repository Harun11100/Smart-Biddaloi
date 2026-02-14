"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// TEMPORARY STATIC EVENTS
const events = [
  {
    id: 1,
    title: "Annual Sports Day",
    time: "9:00 AM – 3:00 PM",
    description:
      "Inter-class sports competitions including athletics, football, and relay races.",
    date: "2025-02-18",
    type: "Sports",
  },
  {
    id: 2,
    title: "Parents–Teachers Meeting",
    time: "10:00 AM – 1:00 PM",
    description:
      "Discussion on students’ academic progress and overall performance.",
    date: "2025-02-20",
    type: "Meeting",
  },
  {
    id: 3,
    title: "Science Fair 2025",
    time: "11:00 AM – 4:00 PM",
    description:
      "Students will present innovative science projects and experiments.",
    date: "2025-02-25",
    type: "Academic",
  }
];

const EventCalendar = () => {
  const [value, onChange] = useState(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="menu" width={20} height={20} />
      </div>

      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>

            <p className="mt-2 text-gray-400 text-sm">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
