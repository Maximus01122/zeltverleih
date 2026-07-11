package de.zeltverleih.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "invoice_item")
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal quantity;

    @NotNull
    private BigDecimal unitPrice;

    private int position;

    protected InvoiceItem() {}

    public InvoiceItem(String description, BigDecimal quantity, BigDecimal unitPrice, int position) {
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.position = position;
    }

    public Long getId() { return id; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

    public String getDescription() { return description; }

    public BigDecimal getQuantity() { return quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }

    public int getPosition() { return position; }
}
