package de.zeltverleih.controller;

import de.zeltverleih.model.datenbank.SetupService;
import de.zeltverleih.model.datenbank.SetupServiceName;
import de.zeltverleih.service.SetupServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/service")
@CrossOrigin
public class SetupServiceController {

    @Autowired
    private SetupServiceService setupServiceService;



    @PostMapping("/add")
    public SetupService createSetupService(@RequestBody SetupService material) throws Exception {
        return setupServiceService.saveSetupService(material);
    }

    @DeleteMapping("/{id}")
    public void deleteSetupService(@PathVariable Long id) {
        setupServiceService.deleteSetupService(id);
    }

    @GetMapping("/getAll")
    public List<SetupService> getAllSetupServices() {
        return setupServiceService.findAll();
    }

    @GetMapping("/serviceNames")
    public List<SetupServiceName> getAllSetupServiceNames() {
        return List.of(SetupServiceName.values());
    }

    @GetMapping("/{id}")
    public SetupService getSetupServiceById (@PathVariable Long id) {
        return setupServiceService.findById(id);
    }

}

