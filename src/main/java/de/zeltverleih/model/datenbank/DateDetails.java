package de.zeltverleih.model.datenbank;

import javax.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public class DateDetails {
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate offerDate;

    private LocalDate validUntil;


    public DateDetails(LocalDate startDate, LocalDate endDate, LocalDate offerDate, LocalDate validUntil) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.offerDate = offerDate;
        this.validUntil = validUntil;
    }

    public DateDetails() {
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDate getOfferDate() {
        return offerDate;
    }

    public void setOfferDate(LocalDate offerDate) {
        this.offerDate = offerDate;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }
}
