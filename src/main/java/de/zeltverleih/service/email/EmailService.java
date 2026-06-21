package de.zeltverleih.service.email;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public String sendEmail(String recipient, String subject, String body) {
        // TODO: implement email sending
        return "Email sent to " + recipient;
    }
}
