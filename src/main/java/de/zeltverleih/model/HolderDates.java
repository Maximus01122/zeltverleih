package de.zeltverleih.model;
import java.time.LocalDate;
import java.util.Objects;

public class HolderDates {
    private LocalDate startDate;
    private LocalDate endDate;

    public HolderDates(LocalDate startDate, LocalDate endDate) {
        this.startDate = Objects.requireNonNull(startDate,"Startdatum darf nicht null sein");;
        this.endDate = Objects.requireNonNull(endDate,"Enddatum darf nicht null sein");;
    }

    public HolderDates(){}

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = Objects.requireNonNull(startDate,"Startdatum darf nicht null sein");
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = Objects.requireNonNull(endDate,"Enddatum darf nicht null sein");
    }
}
