package de.zeltverleih.model.datenbank;

import javax.persistence.Embeddable;

@Embeddable
public class CostDetails {
    private int countDailyRent;
    private int countWeekendRent;
    private int deliveryCosts;

    public CostDetails() {
    }

    public CostDetails(int countDailyRent, int countWeekendRent, int deliveryCosts) {
        this.countDailyRent = countDailyRent;
        this.countWeekendRent = countWeekendRent;
        this.deliveryCosts = deliveryCosts;
    }

    // Getters and Setters

    public int getCountDailyRent() {
        return countDailyRent;
    }

    public void setCountDailyRent(int countDailyRent) {
        this.countDailyRent = countDailyRent;
    }

    public int getCountWeekendRent() {
        return countWeekendRent;
    }

    public void setCountWeekendRent(int countWeekendRent) {
        this.countWeekendRent = countWeekendRent;
    }

    public int getDeliveryCosts() {
        return deliveryCosts;
    }

    public void setDeliveryCosts(int deliveryCosts) {
        this.deliveryCosts = deliveryCosts;
    }
}
