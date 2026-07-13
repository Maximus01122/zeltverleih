package de.zeltverleih.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.einvoice")
public record EInvoiceProperties(
        String profile,
        int zugferdVersion,
        String sellerCountry,
        String buyerCountryDefault,
        String unitCode
) {}
