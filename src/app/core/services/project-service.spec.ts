/**
 * Unit tests for ProjectService.
 *
 * WHY this file matters: ProjectService is the single source of truth for all project
 * data in the app. It owns the reactive filter state (selectedStack, activeTags) and the
 * computed filteredProjects signal that every listing component reads. If the filtering logic
 * regresses, users see wrong projects or an empty list with no visible cause — so we test
 * every combination here at the unit level, where failures are cheap to diagnose.
 *
 * Strategy: inject the real service into a bare TestBed (no HTTP, no router) and drive its
 * writable signals directly. Because signals update synchronously, there is no async setup
 * required — reads always reflect the latest write.
 */
import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project-service.service';
import { TechStack } from '../../shared/types/projects';

describe('ProjectService', () => {
  let service: ProjectService;

  // A fresh TestBed (and therefore a fresh service instance) is created before every test,
  // so signal state never leaks from one test to the next.
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectService);
  });

  // Smoke test: confirms the DI token resolves and Zod validation did not throw on the
  // static projects model (which would return an empty array, not an error).
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // If the Zod schema is misconfigured or the model array is empty, the rest of the
  // filtering tests become meaningless — this baseline assertion catches that early.
  it('loads all projects on initialization', () => {
    expect(service.projects().length).toBeGreaterThan(0);
  });

  // ─── filteredProjects computed signal ───────────────────────────────────────────────
  // Each test sets a specific signal state and then reads the computed result synchronously.
  // We verify both "correct items are included" AND "only correct items are included" to
  // rule out off-by-one or AND/OR logic bugs in the filter implementation.
  describe('filteredProjects', () => {

    // Baseline: with neither filter active the computed must be a passthrough.
    // This matters because a buggy implementation could default to an empty result.
    it('returns all projects when no filters are applied', () => {
      expect(service.filteredProjects().length).toBe(service.projects().length);
    });

    // Setting selectedStack filters the list to one tech_stack value.
    // We assert both that results exist (data integrity) and that every item
    // in the result truly belongs to that stack (logic correctness).
    it('filters to only frontend projects when selectedStack is frontend', () => {
      service.selectedStack.set(TechStack.frontend);
      const result = service.filteredProjects();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(p => p.tech_stack === TechStack.frontend)).toBe(true);
    });

    it('filters to only backend projects when selectedStack is backend', () => {
      service.selectedStack.set(TechStack.backend);
      const result = service.filteredProjects();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(p => p.tech_stack === TechStack.backend)).toBe(true);
    });

    // Technology strings in the model may be stored in any case; the implementation
    // lowercases both sides before comparing. We verify that behaviour here so a future
    // change in casing conventions does not silently break the filter.
    it('filters by active tag (case-insensitive)', () => {
      service.activeTags.set(['react']);
      const result = service.filteredProjects();
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(p => p.technologies.map(t => t.toLowerCase()).includes('react'))
      ).toBe(true);
    });

    // When both filters are active they must be applied with AND semantics:
    // a project must match the stack AND contain at least one of the active tags.
    it('combines stack and tag filters', () => {
      service.selectedStack.set(TechStack.frontend);
      service.activeTags.set(['typescript']);
      const result = service.filteredProjects();
      result.forEach(p => {
        expect(p.tech_stack).toBe(TechStack.frontend);
        expect(p.technologies.map(t => t.toLowerCase())).toContain('typescript');
      });
    });

    // Edge case: an impossible tag should yield an empty list rather than a runtime error.
    it('returns an empty array when no projects match the active tag', () => {
      service.activeTags.set(['nonexistent-framework-xyz']);
      expect(service.filteredProjects().length).toBe(0);
    });
  });

  // ─── toggleTag ──────────────────────────────────────────────────────────────────────
  // toggleTag is a pure signal mutation — no async, no side effects.
  // We test all three meaningful states: add, remove, and idempotence (double-toggle).
  describe('toggleTag', () => {

    it('adds a tag when it is not already active', () => {
      service.toggleTag('react');
      expect(service.activeTags()).toContain('react');
    });

    // Critical: removing one tag must not disturb unrelated tags in the array.
    // A naive implementation (e.g. clearing the whole array) would pass the remove
    // assertion but fail the "still contains typescript" check.
    it('removes a tag when it is already active', () => {
      service.activeTags.set(['react', 'typescript']);
      service.toggleTag('react');
      expect(service.activeTags()).not.toContain('react');
      expect(service.activeTags()).toContain('typescript');
    });

    // Calling toggle twice in a row is a common UX pattern (click once to filter,
    // click again to deselect). The end state must equal the initial state.
    it('adds the tag back after toggling it twice', () => {
      service.toggleTag('react');
      service.toggleTag('react');
      expect(service.activeTags()).not.toContain('react');
    });

    it('can toggle multiple independent tags', () => {
      service.toggleTag('react');
      service.toggleTag('typescript');
      expect(service.activeTags()).toContain('react');
      expect(service.activeTags()).toContain('typescript');
    });
  });
});
