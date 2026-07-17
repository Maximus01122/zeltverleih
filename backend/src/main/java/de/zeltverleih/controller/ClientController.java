package de.zeltverleih.controller;

import de.zeltverleih.dto.response.ClientSearchResponse;
import de.zeltverleih.service.ClientService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/search")
    public List<ClientSearchResponse> search(@RequestParam String q) {
        return clientService.searchByName(q);
    }
}
