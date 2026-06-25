package de.zeltverleih.service.email;

import de.zeltverleih.model.datenbank.QuoteRequest;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.notification-to:}")
    private String notificationTo;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendQuoteNotification(QuoteRequest req, Long clientId) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.warn("E-Mail übersprungen: MAIL_USERNAME nicht gesetzt (Anfrage #{} von {})",
                    req.getId(), req.getName());
            return;
        }
        if (mailPassword == null || mailPassword.isBlank()) {
            log.warn("E-Mail übersprungen: MAIL_PASSWORD nicht gesetzt (Anfrage #{} von {})",
                    req.getId(), req.getName());
            return;
        }

        String recipient = (notificationTo != null && !notificationTo.isBlank())
                ? notificationTo.trim()
                : fromEmail;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(recipient);
            helper.setSubject("Neue Anfrage von " + req.getName());

            String body = "<h2>Neue Angebotsanfrage</h2>"
                + "<p>Eingegangen über das Kontaktformular auf zeltverleiherfurt.de</p>"
                + "<table style='border-collapse:collapse;font-family:sans-serif;width:100%;max-width:600px'>"
                + row("Kunden-ID", clientId != null ? clientId.toString() : null)
                + row("Name", req.getName())
                + row("E-Mail", req.getEmail())
                + row("Telefon", req.getPhone())
                + row("Veranstaltung", req.getEventType())
                + row("Datum", req.getEventDate())
                + row("Gäste", req.getGuestCount())
                + row("Anzahl Zelte", req.getTentCount())
                + row("Zeltgröße", req.getTentSize())
                + row("Lieferort", formatDelivery(req.getDeliveryPostalCode(), req.getDeliveryCity()))
                + row("Servicepaket", req.getServicePackage())
                + row("Zubehör", req.getAccessories())
                + row("Untergrund", req.getGround())
                + row("Nachricht", req.getMessage())
                + "</table>"
                + "<p style='margin-top:16px;font-size:13px;color:#666'>"
                + "Anfrage in der Buchungsapp unter „Anfragen“ einsehen.</p>";

            helper.setText(body, true);
            mailSender.send(message);
            log.info("Benachrichtigung gesendet an {} (Anfrage #{} von {})",
                    recipient, req.getId(), req.getName());
        } catch (Exception e) {
            log.error("E-Mail-Versand fehlgeschlagen für Anfrage #{}: {}", req.getId(), e.getMessage());
        }
    }

    public String sendEmail(String recipient, String subject, String body) {
        if (fromEmail == null || fromEmail.isBlank()) {
            return "Fehler: MAIL_USERNAME nicht konfiguriert";
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(body, false);
            mailSender.send(message);
            return "Email sent to " + recipient;
        } catch (Exception e) {
            return "Fehler: " + e.getMessage();
        }
    }

    private String formatDelivery(String postalCode, String city) {
        boolean hasPlz = postalCode != null && !postalCode.isBlank();
        boolean hasCity = city != null && !city.isBlank();
        if (hasPlz && hasCity) return postalCode + " " + city;
        if (hasPlz) return postalCode;
        if (hasCity) return city;
        return null;
    }

    private String row(String label, String value) {
        return "<tr><td style='padding:6px 12px;font-weight:bold;background:#f5f5f5;width:140px'>" + label + "</td>"
             + "<td style='padding:6px 12px'>" + (value != null && !value.isBlank() ? escapeHtml(value) : "—") + "</td></tr>";
    }

    private String escapeHtml(String text) {
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
