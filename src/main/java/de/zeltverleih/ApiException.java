package de.zeltverleih;

import org.springframework.http.HttpStatus;

import java.time.ZonedDateTime;

public class ApiException {
    private final HttpStatus httpStatus;
    private final String message;
    private final ZonedDateTime zonedDateTime;

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getMessage() {
        return message;
    }


    public ZonedDateTime getZonedDateTime() {
        return zonedDateTime;
    }

    public ApiException(HttpStatus httpStatus, String message, ZonedDateTime zonedDateTime) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.zonedDateTime = zonedDateTime;
    }
}

