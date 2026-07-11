package de.zeltverleih.dto.request;

import de.zeltverleih.enums.SetupService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record BookingRequest(
        @Valid @NotNull ClientData client,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotEmpty List<@Valid MaterialLine> materials,
        Set<SetupService> services,
        Long loadingFeeId,
        String comment,
        Boolean ignoreAvailability
) {
    // Only name and email are mandatory (email is the unique client key);
    // phone and address details are optional.
    public record ClientData(
            @NotBlank String name,
            @NotBlank @Email String email,
            String phoneNumber,
            String street,
            String houseNumber,
            String postalCode,
            String city
    ) {}
}
