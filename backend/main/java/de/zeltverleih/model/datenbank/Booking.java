package de.zeltverleih.model.datenbank;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.List;

@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<BookingMaterial> bookingMaterials;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SetupService> setupServices;

    @ManyToOne
    @JoinColumn(name = "loading_fee_id")
    private LoadingFee loadingFee;

    @Embedded
    private DateDetails dateDetails;

    @Embedded
    private CostDetails costDetails;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column
    private String invoiceNumber;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public List<BookingMaterial> getBookingMaterials() {
        return bookingMaterials;
    }

    public void setBookingMaterials(List<BookingMaterial> bookingMaterials) {
        this.bookingMaterials = bookingMaterials;
    }

    public List<SetupService> getSetupServices() {
        return setupServices;
    }

    public void setSetupServices(List<SetupService> setupServices) {
        this.setupServices = setupServices;
    }

    public LoadingFee getLoadingFee() {
        return loadingFee;
    }

    public void setLoadingFee(LoadingFee loadingFee) {
        this.loadingFee = loadingFee;
    }

    public DateDetails getDateDetails() {
        return dateDetails;
    }

    public void setDateDetails(DateDetails dateDetails) {
        this.dateDetails = dateDetails;
    }

    public CostDetails getCostDetails() {
        return costDetails;
    }

    public void setCostDetails(CostDetails costDetails) {
        this.costDetails = costDetails;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }
}
