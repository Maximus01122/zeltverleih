package de.zeltverleih.model;

import de.zeltverleih.model.datenbank.CostDetails;

import java.time.LocalDate;

public class OfferInfos extends CostDetails {
    private LocalDate validUntil;

    public OfferInfos(int countDailyRent, int countWeekendRent, int deliveryCosts, LocalDate validUntil) {
        super(countDailyRent, countWeekendRent, deliveryCosts);
        this.validUntil = validUntil;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }
}
