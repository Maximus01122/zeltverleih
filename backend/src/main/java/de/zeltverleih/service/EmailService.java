package de.zeltverleih.service;

import de.zeltverleih.entity.QuoteRequest;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

/**
 * Sends quote request notifications. If SMTP is not configured, sending is
 * skipped and logged — mail problems must never fail request processing.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter GERMAN_DATE = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    private final JavaMailSender mailSender;
    private final String notificationTo;
    private final String fromEmail;
    private final String mailPassword;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider,
                        @Value("${app.mail.notification-to}") String notificationTo,
                        @Value("${app.mail.from}") String from,
                        @Value("${spring.mail.username:}") String mailUsername,
                        @Value("${spring.mail.password:}") String mailPassword) {
        this.mailSender = mailSenderProvider.getIfAvailable();
        this.notificationTo = notificationTo;
        this.fromEmail = (mailUsername != null && !mailUsername.isBlank()) ? mailUsername : from;
        this.mailPassword = mailPassword;
    }

    public void sendQuoteRequestNotification(QuoteRequest quote) {
        if (!isMailConfigured()) {
            log.warn("E-Mail übersprungen: MAIL_USERNAME/MAIL_PASSWORD nicht gesetzt (Anfrage #{} von {})",
                    quote.getId(), quote.getName());
            return;
        }

        String internalRecipient = (notificationTo != null && !notificationTo.isBlank())
                ? notificationTo.trim()
                : fromEmail;

        sendHtmlEmail(
                internalRecipient,
                "Neue Anfrage von " + quote.getName(),
                "<h2>Neue Angebotsanfrage</h2>" + buildQuoteTable(quote),
                "Benachrichtigung",
                quote);
    }

    public void sendQuoteRequestConfirmation(QuoteRequest quote) {
        if (!isMailConfigured()) {
            return;
        }

        String customerEmail = quote.getEmail() != null ? quote.getEmail().trim() : "";
        if (customerEmail.isBlank()) {
            log.warn("Kunden-Bestätigung übersprungen: keine E-Mail-Adresse (Anfrage #{} von {})",
                    quote.getId(), quote.getName());
            return;
        }

        sendHtmlEmail(
                customerEmail,
                "Eingangsbestätigung der Anfrage Zeltverleih Erfurt",
                "<p>Ihre Buchungsanfrage ist bei uns eingegangen.</p>" + buildQuoteTable(quote),
                "Eingangsbestätigung",
                quote);
    }

    private boolean isMailConfigured() {
        return mailSender != null
                && fromEmail != null && !fromEmail.isBlank()
                && mailPassword != null && !mailPassword.isBlank();
    }

    private void sendHtmlEmail(String recipient, String subject, String htmlBody, String kind, QuoteRequest quote) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("{} gesendet an {} (Anfrage #{} von {})", kind, recipient, quote.getId(), quote.getName());
        } catch (Exception e) {
            log.error("{} fehlgeschlagen für Anfrage #{} ({}): {}", kind, quote.getId(), recipient, e.getMessage());
        }
    }

    private String buildQuoteTable(QuoteRequest req) {
        return "<table style='border-collapse:collapse;font-family:sans-serif;width:100%;max-width:600px'>"
                + row("Name", req.getName())
                + row("E-Mail", req.getEmail())
                + row("Telefon", req.getPhone())
                + row("Veranstaltung", req.getEventType())
                + row("Datum", formatEventDate(req))
                + row("Gäste", req.getGuestCount())
                + row("Anzahl Zelte", req.getTentCount())
                + row("Zeltgröße", req.getTentSize())
                + row("Lieferort", formatDelivery(req.getDeliveryPostalCode(), req.getDeliveryCity()))
                + row("Servicepaket", req.getServicePackage())
                + rowHtml("Zubehör", formatMultilineHtml(req.getAccessories()))
                + row("Untergrund", req.getGround())
                + row("Nachricht", req.getMessage())
                + "</table>";
    }

    private String formatEventDate(QuoteRequest req) {
        if (req.getEventDate() == null) {
            return null;
        }
        return GERMAN_DATE.format(req.getEventDate());
    }

    private String formatDelivery(String postalCode, String city) {
        boolean hasPlz = postalCode != null && !postalCode.isBlank();
        boolean hasCity = city != null && !city.isBlank();
        if (hasPlz && hasCity) {
            return postalCode + " " + city;
        }
        if (hasPlz) {
            return postalCode;
        }
        if (hasCity) {
            return city;
        }
        return null;
    }

    private String row(String label, String value) {
        return "<tr><td style='padding:6px 12px;font-weight:bold;background:#f5f5f5;width:140px'>" + label + "</td>"
                + "<td style='padding:6px 12px'>"
                + (value != null && !value.isBlank() ? escapeHtml(value) : "—")
                + "</td></tr>";
    }

    private String rowHtml(String label, String htmlValue) {
        return "<tr><td style='padding:6px 12px;font-weight:bold;background:#f5f5f5;width:140px'>" + label + "</td>"
                + "<td style='padding:6px 12px'>"
                + (htmlValue != null && !htmlValue.isBlank() ? htmlValue : "—")
                + "</td></tr>";
    }

    private String formatMultilineHtml(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }
        return escapeHtml(text).replace("\r\n", "\n").replace("\n", "<br>");
    }

    private String escapeHtml(String text) {
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
