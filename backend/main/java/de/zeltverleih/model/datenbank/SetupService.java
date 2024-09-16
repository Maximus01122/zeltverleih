package de.zeltverleih.model.datenbank;


import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

import java.util.List;

@Entity
public class SetupService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SetupServiceName name;
    private double price;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonBackReference
    private Booking booking;

    public SetupService(SetupServiceName name, double price, Booking booking) {
        this.name = name;
        this.price = price;
        this.booking = booking;
    }

    public SetupService() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public SetupServiceName getName() {
        return name;
    }

    public void setName(SetupServiceName name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }
}
