package de.zeltverleih;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ZeltverleihApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZeltverleihApplication.class, args);
    }
}
