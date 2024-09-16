package de.zeltverleih;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZonedDateTime;

@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(value = {ApiRequestException.class})
    public ResponseEntity<Object> handleApiException (ApiRequestException e){
        ApiException a = new ApiException(HttpStatus.BAD_REQUEST, e.getMessage(), ZonedDateTime.now());
        return new ResponseEntity<>(a, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {NullPointerException.class, IllegalArgumentException.class,
                               IllegalStateException.class, RuntimeException.class})
    public ResponseEntity<Object> handleAllException (Exception e){
        System.out.println("Fehlermeldung: " + e.getMessage());
        ApiException a = new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), ZonedDateTime.now());
        return new ResponseEntity<>(a, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

