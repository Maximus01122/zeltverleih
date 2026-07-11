package de.zeltverleih.controller;

import de.zeltverleih.dto.response.BookingDashboardResponse;
import de.zeltverleih.dto.response.FinanceDashboardResponse;
import de.zeltverleih.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/finance")
    public FinanceDashboardResponse finance() {
        return dashboardService.finance();
    }

    @GetMapping("/bookings")
    public BookingDashboardResponse bookings() {
        return dashboardService.bookings();
    }
}
