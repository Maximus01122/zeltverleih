package de.zeltverleih.dto.response;

public record BookingDashboardResponse(
        int year,
        long completedThisYear
) {}
