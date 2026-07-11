package de.zeltverleih.entity;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "client_seq")
    @SequenceGenerator(name = "client_seq", sequenceName = "client_seq", allocationSize = 1)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long customerNumber;

    @Column(nullable = false)
    private String name;

    // Optional; unique when present. Most DBs allow multiple NULLs in a unique column,
    // so clients without an email simply are not deduplicated.
    @Email
    @Column(unique = true)
    private String email;

    private String phoneNumber;

    @Valid
    @Embedded
    private Address address;

    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<Booking> bookings = new ArrayList<>();

    protected Client() {}

    public Client(long customerNumber, String name, String email, String phoneNumber, Address address) {
        this.customerNumber = customerNumber;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public Long getId() { return id; }

    /** Assigned once at creation from the customer_number sequence; may be adjusted when invoicing. */
    public Long getCustomerNumber() { return customerNumber; }
    public void setCustomerNumber(Long customerNumber) { this.customerNumber = customerNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

    public List<Booking> getBookings() { return bookings; }
}
