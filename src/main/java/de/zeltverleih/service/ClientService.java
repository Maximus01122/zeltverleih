package de.zeltverleih.service;

import de.zeltverleih.model.datenbank.Client;
import de.zeltverleih.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public Client getClientByName(String name) {
        Optional<Client> client = clientRepository.findByName(name);
        return client.orElseThrow(() -> new RuntimeException("Client not found with name: " + name));
    }

    public Client getClientById(Long id) {
        Optional<Client> client = clientRepository.findById(id);
        return client.orElseThrow(() -> new RuntimeException("Client not found with ID: " + id));
    }

    public Client saveClient(Client client){
        return clientRepository.save(client);
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }

    public List<Client> findAll() {
        return clientRepository.findAll();
    }
}

