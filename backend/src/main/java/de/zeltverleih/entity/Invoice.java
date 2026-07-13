package de.zeltverleih.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String invoiceNumber;

    @NotNull
    private LocalDate invoiceDate;

    @NotNull
    private LocalDate serviceDate;

    @NotNull
    private LocalDate dueDate;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<InvoiceItem> items = new ArrayList<>();

    @Column(nullable = false)
    private boolean einvoice = false;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "einvoice_xml")
    private byte[] einvoiceXml;

    protected Invoice() {}

    public Invoice(Booking booking, String invoiceNumber,
                   LocalDate invoiceDate, LocalDate serviceDate, LocalDate dueDate) {
        this.booking = booking;
        this.invoiceNumber = invoiceNumber;
        this.invoiceDate = invoiceDate;
        this.serviceDate = serviceDate;
        this.dueDate = dueDate;
    }

    public void addItem(InvoiceItem item) {
        item.setInvoice(this);
        items.add(item);
    }

    public Long getId() { return id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }

    public LocalDate getServiceDate() { return serviceDate; }
    public void setServiceDate(LocalDate serviceDate) { this.serviceDate = serviceDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public List<InvoiceItem> getItems() { return items; }

    public boolean isEinvoice() { return einvoice; }
    public void setEinvoice(boolean einvoice) { this.einvoice = einvoice; }

    public byte[] getEinvoiceXml() { return einvoiceXml; }
    public void setEinvoiceXml(byte[] einvoiceXml) { this.einvoiceXml = einvoiceXml; }
}
