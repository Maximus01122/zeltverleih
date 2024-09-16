package de.zeltverleih.service;

import de.zeltverleih.model.datenbank.SetupService;
import de.zeltverleih.repository.SetupServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SetupServiceService {

    @Autowired
    private SetupServiceRepository setupServiceRepository;


    public SetupService findById(Long id) {
        Optional<SetupService> setupService = setupServiceRepository.findById(id);
        return setupService.orElseThrow(() -> new RuntimeException("Setup-Service not found with ID: " + id));
    }

    public SetupService saveSetupService(SetupService client){
        return setupServiceRepository.save(client);
    }

    public void deleteSetupService(Long id) {
        setupServiceRepository.deleteById(id);
    }

    public List<SetupService> findAll() {
        return setupServiceRepository.findAll();
    }
}

