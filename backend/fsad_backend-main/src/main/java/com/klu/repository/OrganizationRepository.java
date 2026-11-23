package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klu.model.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> { }
