package org.demo.microservice.controller;

import static org.cxbox.api.service.session.InternalAuthorizationService.SystemUsers.VANILLA;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.cxbox.api.service.session.InternalAuthorizationService;
import org.demo.microservice.core.querylang.common.FilterParameters;
import org.demo.microservice.dto.DictDTO;
import org.demo.microservice.entity.ListOfValues;
import org.demo.microservice.repository.LovDataRepository;
import org.demo.microservice.service.LovMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Transactional
@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/api/v1/lov")
public class LovController {

	private final LovDataRepository lovDataRepository;

	private final LovMapper lovMapper;

	private final InternalAuthorizationService authzService;

	@GetMapping("/{id}")
	public ResponseEntity<DictDTO> getOne(@PathVariable final Long id) {
		authzService.loginAs(authzService.createAuthentication(VANILLA));
		return ResponseEntity.ok().body(lovDataRepository.findById(id).map(lovMapper::toDto).orElse(null));
	}

	@GetMapping
	public ResponseEntity<Page<DictDTO>> getAll(
			final Pageable pageable,
			final FilterParameters<DictDTO> parameters) {
		authzService.loginAs(authzService.createAuthentication(VANILLA));
		final var specification = lovDataRepository.getSpecification(parameters, DictDTO.class);
		final var entityPageable = lovDataRepository.getEntityPageable(pageable, DictDTO.class);
		return ResponseEntity.ok().body(lovDataRepository.findAll(specification, entityPageable).map(lovMapper::toDto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable final Long id) {
		authzService.loginAs(authzService.createAuthentication(VANILLA));
		lovDataRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}

	/**
	 * @param request (id must be empty)
	 * @return dto with filled id and optionally updated fields (accordingly to business logic)
	 */
	@PostMapping
	public ResponseEntity<DictDTO> create(@RequestBody final DictDTO request) {
		authzService.loginAs(authzService.createAuthentication(VANILLA));
		if (request.getId() != null) {
			throw new IllegalArgumentException("Id must be null for creation process");
		}
		return ResponseEntity.ok().body(lovMapper.toDto(lovDataRepository.save(lovMapper.newEntityByDto(null, request))));
	}

	/**
	 * @param request (id mustn't be empty)
	 * @return dto with filled id and optionally updated fields (accordingly to business logic)
	 */
	@PutMapping
	public ResponseEntity<DictDTO> update(@RequestBody final DictDTO request) {
		authzService.loginAs(authzService.createAuthentication(VANILLA));
		if (request.getId() == null) {
			throw new IllegalArgumentException("Id mustn't be null for update process");
		}
		final ListOfValues entity = lovMapper.updateEntityByDto(
				lovDataRepository.findById(Long.valueOf(request.getId())).orElseThrow(),
				request
		);
		return ResponseEntity.ok().body(lovMapper.toDto(lovDataRepository.save(entity)));
	}

}
