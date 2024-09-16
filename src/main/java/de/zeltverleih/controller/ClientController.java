package de.zeltverleih.controller;

import de.zeltverleih.model.datenbank.Client;
import de.zeltverleih.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/client")
@CrossOrigin
public class ClientController {

    @Autowired
    private ClientService clientService;

    @PostMapping("/add")
    public Client createClient(@RequestBody Client client) {
        return clientService.saveClient(client);
    }


    @PutMapping("/update")
    public Client updateClient(@RequestBody Client updatedClient) {
        Long id = updatedClient.getId();  // Die ID wird aus dem Client-Objekt geholt

        if (id == null) {
            throw new IllegalArgumentException("Client ID cannot be null");
        }

        Client existingClient = clientService.getClientById(id);

        // Aktualisiere die Felder des vorhandenen Clients
        existingClient.setName(updatedClient.getName());
        existingClient.setPhoneNumber(updatedClient.getPhoneNumber());
        existingClient.setEmail(updatedClient.getEmail());
        existingClient.setCustomerNumber(updatedClient.getCustomerNumber());
        existingClient.setAddress(updatedClient.getAddress());

        // Speichere den aktualisierten Client und gib ihn zurück
        return clientService.saveClient(existingClient);
    }

    @GetMapping("/{id}")
    public Client getByClientID(@PathVariable Long id) {
        return clientService.getClientById(id);
    }

    @GetMapping("/getByName/{clientName}")
    public Client getByName(@PathVariable String clientName) {
        return clientService.getClientByName(clientName);
    }


    @GetMapping("/getAll")
    public List<Client> getAllClients() {
        return clientService.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
    }
}
