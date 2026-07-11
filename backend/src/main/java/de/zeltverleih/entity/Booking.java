package de.zeltverleih.entity;

import de.zeltverleih.enums.BookingStatus;
import de.zeltverleih.enums.SetupService;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.UNPROCESSED;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private LocalDate offerDate;
    private LocalDate validUntil;

    private Integer countDailyRent;
    private Integer countWeekendRent;

    private BigDecimal deliveryCosts;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "loading_fee_id")
    private LoadingFee loadingFee;

    @Column(length = 2000)
    private String comment;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingMaterial> bookingMaterials = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "booking_service", joinColumns = @JoinColumn(name = "booking_id"))
    @Column(name = "service_name")
    @Enumerated(EnumType.STRING)
    private Set<SetupService> services = new HashSet<>();

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Invoice invoice;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<OfferItem> offerItems = new ArrayList<>();

    protected Booking() {}

    public Booking(Client client, LocalDate startDate, LocalDate endDate) {
        this.client = client;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public void addMaterial(Material material, int quantity) {
        bookingMaterials.add(new BookingMaterial(this, material, quantity));
    }

    public void clearMaterials() {
        bookingMaterials.clear();
    }

    public void replaceServices(Set<SetupService> newServices) {
        services.clear();
        if (newServices != null) {
            services.addAll(newServices);
        }
    }

    public Long getId() { return id; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDate getOfferDate() { return offerDate; }
    public void setOfferDate(LocalDate offerDate) { this.offerDate = offerDate; }

    public LocalDate getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }

    public Integer getCountDailyRent() { return countDailyRent; }
    public void setCountDailyRent(Integer countDailyRent) { this.countDailyRent = countDailyRent; }

    public Integer getCountWeekendRent() { return countWeekendRent; }
    public void setCountWeekendRent(Integer countWeekendRent) { this.countWeekendRent = countWeekendRent; }

    public BigDecimal getDeliveryCosts() { return deliveryCosts; }
    public void setDeliveryCosts(BigDecimal deliveryCosts) { this.deliveryCosts = deliveryCosts; }

    public LoadingFee getLoadingFee() { return loadingFee; }
    public void setLoadingFee(LoadingFee loadingFee) { this.loadingFee = loadingFee; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public List<BookingMaterial> getBookingMaterials() { return bookingMaterials; }

    public Set<SetupService> getServices() { return services; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

    public List<OfferItem> getOfferItems() { return offerItems; }

    public void replaceOfferItems(List<OfferItem> newItems) {
        offerItems.clear();
        for (OfferItem item : newItems) {
            item.setBooking(this);
            offerItems.add(item);
        }
    }
}
