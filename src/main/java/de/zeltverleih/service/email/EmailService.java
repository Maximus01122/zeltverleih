package de.zeltverleih.service.email;

import de.zeltverleih.model.datenbank.QuoteRequest;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendQuoteNotification(QuoteRequest req) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(fromEmail);
            helper.setReplyTo(req.getEmail());
            helper.setSubject("Neue Anfrage von " + req.getName());

            String body = "<h2>Neue Angebotsanfrage</h2>"
                + "<table style='border-collapse:collapse;font-family:sans-serif'>"
                + row("Name", req.getName())
                + row("E-Mail", req.getEmail())
                + row("Telefon", req.getPhone())
                + row("Veranstaltung", req.getEventType())
                + row("Datum", req.getEventDate())
                + row("Gäste", req.getGuestCount())
                + row("Zeltgröße", req.getTentSize())
                + row("Servicepaket", req.getServicePackage())
                + row("Zubehör", req.getAccessories())
                + row("Untergrund", req.getGround())
                + row("Nachricht", req.getMessage())
                + "</table>";

            helper.setText(body, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Fehler beim E-Mail-Versand: " + e.getMessage());
        }
    }

    private String row(String label, String value) {
        return "<tr><td style='padding:6px 12px;font-weight:bold;background:#f5f5f5'>" + label + "</td>"
             + "<td style='padding:6px 12px'>" + (value != null ? value : "—") + "</td></tr>";
    }
}
