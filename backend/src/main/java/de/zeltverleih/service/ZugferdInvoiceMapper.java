package de.zeltverleih.service;

import de.zeltverleih.config.CompanyProperties;
import de.zeltverleih.config.EInvoiceProperties;
import de.zeltverleih.dto.response.DocumentItemView;
import de.zeltverleih.entity.Address;
import de.zeltverleih.entity.Client;
import de.zeltverleih.exception.BadRequestException;
import org.mustangproject.Allowance;
import org.mustangproject.BankDetails;
import org.mustangproject.Contact;
import org.mustangproject.Item;
import org.mustangproject.Product;
import org.mustangproject.TradeParty;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class ZugferdInvoiceMapper {

    private static final BigDecimal VAT_PERCENT = new BigDecimal("19");

    private final CompanyProperties company;
    private final EInvoiceProperties einvoiceProperties;

    public ZugferdInvoiceMapper(CompanyProperties company, EInvoiceProperties einvoiceProperties) {
        this.company = company;
        this.einvoiceProperties = einvoiceProperties;
    }

    public void validateBuyerForEInvoice(Client client) {
        List<String> missing = new ArrayList<>();
        if (client.getName() == null || client.getName().isBlank()) {
            missing.add("Name");
        }
        Address address = client.getAddress();
        if (address == null) {
            missing.add("Adresse");
        } else {
            if (isBlank(address.getStreet())) missing.add("Straße");
            if (isBlank(address.getHouseNumber())) missing.add("Hausnummer");
            if (isBlank(address.getPostalCode())) missing.add("PLZ");
            if (isBlank(address.getCity())) missing.add("Ort");
        }
        if (!missing.isEmpty()) {
            throw new BadRequestException(
                    "Für E-Rechnungen fehlen Kundendaten: " + String.join(", ", missing));
        }
    }

    public org.mustangproject.Invoice toMustangInvoice(
            de.zeltverleih.entity.Invoice invoice,
            Client client,
            List<DocumentItemView> items) {
        validateBuyerForEInvoice(client);

        org.mustangproject.Invoice mustangInvoice = new org.mustangproject.Invoice()
                .setNumber(invoice.getInvoiceNumber())
                .setIssueDate(toDate(invoice.getInvoiceDate()))
                .setDueDate(toDate(invoice.getDueDate()))
                .setDeliveryDate(toDate(invoice.getServiceDate()))
                .setReferenceNumber(String.valueOf(client.getCustomerNumber()))
                .setSender(buildSeller())
                .setRecipient(buildBuyer(client))
                .setOwnContact(new Contact(company.owner(), company.phone(), company.email()))
                .setCurrency("EUR");

        for (int i = 0; i < items.size(); i++) {
            DocumentItemView line = items.get(i);
            mustangInvoice.addItem(buildItem(line, i + 1));
        }

        return mustangInvoice;
    }

    private TradeParty buildSeller() {
        TradeParty seller = new TradeParty(
                company.name(),
                company.street(),
                company.postalCode(),
                company.city(),
                einvoiceProperties.sellerCountry());
        seller.addVATID(company.vatId());
        if (company.email() != null && !company.email().isBlank()) {
            seller.setEmail(company.email());
        }
        seller.setContact(new Contact(company.owner(), company.phone(), company.email()));
        seller.addBankDetails(new BankDetails(company.iban(), company.bic()));
        return seller;
    }

    private TradeParty buildBuyer(Client client) {
        Address address = client.getAddress();
        String streetLine = address.getStreet().trim() + " " + address.getHouseNumber().trim();
        TradeParty buyer = new TradeParty(
                client.getName().trim(),
                streetLine,
                address.getPostalCode().trim(),
                address.getCity().trim(),
                einvoiceProperties.buyerCountryDefault());
        buyer.setID(String.valueOf(client.getCustomerNumber()));
        if (client.getEmail() != null && !client.getEmail().isBlank()) {
            buyer.setEmail(client.getEmail());
        }
        if (client.getPhoneNumber() != null && !client.getPhoneNumber().isBlank()) {
            buyer.setContact(new Contact(client.getName(), client.getPhoneNumber(), client.getEmail()));
        }
        return buyer;
    }

    private Item buildItem(DocumentItemView line, int lineNumber) {
        Product product = new Product(
                line.description(),
                line.description(),
                einvoiceProperties.unitCode(),
                VAT_PERCENT);
        product.setUnit(einvoiceProperties.unitCode());

        BigDecimal unitPrice = line.unitPrice();
        BigDecimal quantity = line.quantity();
        if (unitPrice.compareTo(BigDecimal.ZERO) < 0) {
            // EN16931 BR-27: BT-146 (Einzelpreis netto) darf nicht negativ sein.
            // Rabatte/Skonti werden als positionsbezogener Abschlag (BG-27) abgebildet:
            // Position mit Nettopreis 0 € + Allowance in Höhe des Rabattbetrags (BT-136/BT-139).
            // Die sichtbare PDF-Rechnung zeigt weiterhin „Rabatt −10,00 €“ in der Positionstabelle.
            BigDecimal allowanceAmount = unitPrice.abs()
                    .multiply(quantity)
                    .setScale(2, RoundingMode.HALF_UP);
            Item item = new Item(product, BigDecimal.ZERO, quantity)
                    .setId(String.valueOf(lineNumber));
            item.addAllowance(new Allowance(allowanceAmount).setReason(line.description()));
            return item;
        }
        return new Item(product, unitPrice, quantity)
                .setId(String.valueOf(lineNumber));
    }

    private static Date toDate(LocalDate date) {
        return Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
