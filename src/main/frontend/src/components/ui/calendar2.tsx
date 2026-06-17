import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import deLocale from "@fullcalendar/core/locales/de";
import { Booking, Status } from "@/model/AllTypes";
import { useNavigate } from "react-router-dom";

interface BookingCalendarProps {
    bookings: Booking[];
}

function bookingToEvent(booking: Booking): EventInput {
    return {
        id: booking.id?.toString(),
        title: `${booking.client.name}`,
        start: booking.dateDetails.startDate,
        end: booking.dateDetails.endDate,
        backgroundColor: getStatusColor(booking.status),
        extendedProps: { booking },
    };
}

function getStatusColor(status: Status): string {
    switch (status) {
        case "COMPLETED":
            return "#34d399"; // green
        case "OFFER_SENT":
            return "#fbbf24"; // yellow
        case "OFFER_REJECTED":
            return "#f87171"; // red
        default:
            return "#60a5fa"; // blue
    }
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings }) => {
    const [events, setEvents] = useState<EventInput[]>(
        bookings.map(bookingToEvent)
    );
    const navigate = useNavigate();

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true} // ✅ allow selecting dates
            locales={[deLocale]}
            locale="de"
            headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={(info) => {
                const booking = info.event.extendedProps.booking as Booking | undefined;
                if (booking) {
                    navigate("/singleview", { state: { id: booking.id } });
                }
            }}
            select={(info) => {
                const title = prompt("Titel für die Buchung:");
                if (title) {
                    // ✅ Add a temporary event (not yet persisted in DB)
                    const newEvent: EventInput = {
                        title,
                        start: info.startStr,
                        end: info.endStr,
                        backgroundColor: "#3b82f6",
                    };
                    setEvents((prev) => [...prev, newEvent]);
                }
            }}
            height="80vh"
        />
    );
};

export default BookingCalendar;
