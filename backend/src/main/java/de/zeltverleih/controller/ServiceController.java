package de.zeltverleih.controller;

import de.zeltverleih.dto.response.ServiceResponse;
import de.zeltverleih.enums.SetupService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    /** All bookable services for the wizard's service selection step. */
    @GetMapping
    public List<ServiceResponse> list() {
        return Arrays.stream(SetupService.values())
                .map(s -> new ServiceResponse(s.name(), s.getLabel()))
                .toList();
    }
}
