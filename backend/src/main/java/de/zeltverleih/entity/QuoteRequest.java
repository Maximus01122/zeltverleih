package de.zeltverleih.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "quote_requests")
public class QuoteRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime receivedAt;

    private boolean processed = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @NotBlank
    private String name;

    @Email
    private String email;

    private String phone;
    private String eventType;
    private LocalDate eventDate;
    private String guestCount;
    private String tentCount;
    private String tentSize;
    private String deliveryPostalCode;
    private String deliveryCity;
    private String servicePackage;
    @Column(length = 4000)
    private String accessories;

    @Column(columnDefinition = "TEXT")
    private String cartJson;

    private String ground;

    @Column(length = 2000)
    private String message;

    // GDPR proof: consent given via the website form; receivedAt documents when
    private Boolean dataProcessingConsent;

    public QuoteRequest() {}

    public Long getId() { return id; }

    public LocalDateTime getReceivedAt() { return receivedAt; }
    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }

    public boolean isProcessed() { return processed; }
    public void setProcessed(boolean processed) { this.processed = processed; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getGuestCount() { return guestCount; }
    public void setGuestCount(String guestCount) { this.guestCount = guestCount; }

    public String getTentCount() { return tentCount; }
    public void setTentCount(String tentCount) { this.tentCount = tentCount; }

    public String getTentSize() { return tentSize; }
    public void setTentSize(String tentSize) { this.tentSize = tentSize; }

    public String getDeliveryPostalCode() { return deliveryPostalCode; }
    public void setDeliveryPostalCode(String deliveryPostalCode) { this.deliveryPostalCode = deliveryPostalCode; }

    public String getDeliveryCity() { return deliveryCity; }
    public void setDeliveryCity(String deliveryCity) { this.deliveryCity = deliveryCity; }

    public String getServicePackage() { return servicePackage; }
    public void setServicePackage(String servicePackage) { this.servicePackage = servicePackage; }

    public String getAccessories() { return accessories; }
    public void setAccessories(String accessories) { this.accessories = accessories; }

    public String getCartJson() { return cartJson; }
    public void setCartJson(String cartJson) { this.cartJson = cartJson; }

    public String getGround() { return ground; }
    public void setGround(String ground) { this.ground = ground; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean isDataProcessingConsent() { return dataProcessingConsent; }
    public void setDataProcessingConsent(Boolean dataProcessingConsent) { this.dataProcessingConsent = dataProcessingConsent; }
}
