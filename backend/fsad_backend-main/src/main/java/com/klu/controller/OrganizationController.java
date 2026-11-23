package com.klu.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.klu.model.Organization;
import com.klu.repository.OrganizationRepository;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "http://localhost:3000")
public class OrganizationController {
    private final OrganizationRepository repository;
    public OrganizationController(OrganizationRepository repository) { this.repository = repository; }

    @GetMapping public List<Organization> all() { return repository.findAll(); }

    @PostMapping public ResponseEntity<?> create(@RequestBody Organization organization) {
        if (organization.getName() == null || organization.getName().isBlank())
            return ResponseEntity.badRequest().body("Organization name is required");
        if (organization.getStatus() == null || organization.getStatus().isBlank()) organization.setStatus("Pending");
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(organization));
    }

    @PutMapping("/{id}/status") public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusUpdate update) {
        return repository.findById(id).map(org -> {
            if (update.status == null || update.status.isBlank()) return ResponseEntity.badRequest().body("Status is required");
            org.setStatus(update.status);
            return ResponseEntity.ok(repository.save(org));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    public static class StatusUpdate { public String status; }
}
