package de.zeltverleih.entity;

import jakarta.persistence.Embeddable;

/**
 * Completeness is enforced at the API boundary (BookingRequest.ClientData),
 * not here: clients created from website quote requests only carry contact
 * data — their address is filled in once they actually book.
 */
@Embeddable
public class Address {

    private String street;
    private String houseNumber;
    private String postalCode;
    private String city;

    protected Address() {}

    public Address(String street, String houseNumber, String postalCode, String city) {
        this.street = street;
        this.houseNumber = houseNumber;
        this.postalCode = postalCode;
        this.city = city;
    }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getHouseNumber() { return houseNumber; }
    public void setHouseNumber(String houseNumber) { this.houseNumber = houseNumber; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
