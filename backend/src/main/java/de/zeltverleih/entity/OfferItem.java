package de.zeltverleih.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "offer_item")
public class OfferItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal quantity;

    @NotNull
    private BigDecimal unitPrice;

    private int position;

    protected OfferItem() {}

    public OfferItem(String description, BigDecimal quantity, BigDecimal unitPrice, int position) {
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.position = position;
    }

    public Long getId() { return id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getDescription() { return description; }

    public BigDecimal getQuantity() { return quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }

    public int getPosition() { return position; }
}
