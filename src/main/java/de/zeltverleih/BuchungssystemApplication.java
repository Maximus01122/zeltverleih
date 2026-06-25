package de.zeltverleih;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BuchungssystemApplication {
	public static void main(String[] args) {
		SpringApplication.run(BuchungssystemApplication.class, args);
	}
}
