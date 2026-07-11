package de.zeltverleih.dto.response;

import de.zeltverleih.enums.MaterialCategory;

import java.math.BigDecimal;
import java.util.List;

public record FinanceDashboardResponse(
        BigDecimal netTotal,
        BigDecimal vatTotal,
        BigDecimal grossTotal,
        List<MonthlyRevenue> monthlyRevenue,
        List<CategoryRevenue> incomeByCategory,
        List<ServiceRevenue> incomeByService
) {
    public record MonthlyRevenue(int year, int month, BigDecimal net) {}

    public record CategoryRevenue(MaterialCategory category, BigDecimal net) {}

    public record ServiceRevenue(String service, String label, BigDecimal net) {}
}
