package de.zeltverleih.model.datenbank;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quote_requests")
public class QuoteRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String eventType;
    private String eventDate;
    private String guestCount;
    private String tentSize;
    private String servicePackage;
    private String accessories;
    private String ground;

    @Column(length = 2000)
    private String message;

    private LocalDateTime receivedAt = LocalDateTime.now();
    private boolean processed = false;

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public String getGuestCount() { return guestCount; }
    public void setGuestCount(String guestCount) { this.guestCount = guestCount; }
    public String getTentSize() { return tentSize; }
    public void setTentSize(String tentSize) { this.tentSize = tentSize; }
    public String getServicePackage() { return servicePackage; }
    public void setServicePackage(String servicePackage) { this.servicePackage = servicePackage; }
    public String getAccessories() { return accessories; }
    public void setAccessories(String accessories) { this.accessories = accessories; }
    public String getGround() { return ground; }
    public void setGround(String ground) { this.ground = ground; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getReceivedAt() { return receivedAt; }
    public boolean isProcessed() { return processed; }
    public void setProcessed(boolean processed) { this.processed = processed; }
}
