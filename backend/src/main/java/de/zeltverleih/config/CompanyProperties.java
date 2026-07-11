package de.zeltverleih.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.company")
public record CompanyProperties(
        String name,
        String owner,
        String street,
        String postalCode,
        String city,
        String phone,
        String email,
        String website,
        String bankName,
        String bankCode,
        String accountNumber,
        String accountHolder,
        String iban,
        String bic,
        String vatId
) {}
