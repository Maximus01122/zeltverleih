package de.zeltverleih.dto.response;

public record ClientSearchResponse(
        Long id,
        String customerNumber,
        String name,
        String email,
        String phoneNumber,
        String street,
        String houseNumber,
        String postalCode,
        String city
) {}
