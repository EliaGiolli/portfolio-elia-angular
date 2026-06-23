/**
 * Unit tests for ProjectsGrid.
 *
 * WHY this file matters: ProjectsGrid is the main browsing surface for projects. It
 * orchestrates three distinct behaviours that are easy to break independently:
 *
 *  1. Tag list derivation — `currentTags` is a computed signal that returns different
 *     filter chips depending on which stack the route reports. If this diverges from
 *     the route data, the wrong tags appear and users cannot filter correctly.
 *
 *  2. Tag active state — `isTagActive` reads from ProjectService and drives the visual
 *     "active" style on filter chips. If the comparison breaks (e.g. case mismatch),
 *     chips never highlight even when a tag is selected.
 *
 *  3. Service synchronisation via effect — an Angular `effect()` in the constructor
 *     writes `projectService.selectedStack` and resets `activeTags` whenever the `stack`
 *     input changes. If this effect stops running, the service state and the URL's intent
 *     go out of sync: the displayed projects do not match the current route.
 *
 * Strategy: mount the real component with a real ProjectService (providedIn root, so it
 * is automatically available). We drive inputs with setInput() and call detectChanges()
 * to flush the effect scheduler. We inject Location so we can spy on its back() method
 * without needing a real browser history.
 *
 * provideRouter([]) is required for RouterLink bindings in the template.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { ProjectsGrid } from './projects-grid';
import { TechStack } from '../../../shared/types/projects';

describe('ProjectsGrid', () => {
  let component: ProjectsGrid;
  let fixture: ComponentFixture<ProjectsGrid>;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsGrid],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsGrid);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── currentTags ────────────────────────────────────────────────────────────────────
  // currentTags is a pure computed: its only dependency is the `stack` signal input.
  // We verify that the right technology set is returned for each stack value and
  // that specific representative tags are present (not just that the array is non-empty).
  describe('currentTags', () => {

    it('returns frontend tags when stack is frontend', () => {
      fixture.componentRef.setInput('stack', TechStack.frontend);
      fixture.detectChanges();
      const values = component.currentTags().map(t => t.value);
      // Check a representative subset: all three confirm the mapping is correct.
      expect(values).toContain('react');
      expect(values).toContain('typescript');
      expect(values).toContain('tailwindcss');
    });

    it('returns backend tags when stack is backend', () => {
      fixture.componentRef.setInput('stack', TechStack.backend);
      fixture.detectChanges();
      const values = component.currentTags().map(t => t.value);
      expect(values).toContain('nodedotjs');
      expect(values).toContain('mongodb');
      expect(values).toContain('nestjs');
    });

    // The implementation falls through to the backend list when stack is null (default).
    // This prevents a crash before the route data is bound.
    it('returns backend tags by default (stack is null)', () => {
      const values = component.currentTags().map(t => t.value);
      expect(values).toContain('nodedotjs');
    });
  });

  // ─── isTagActive ────────────────────────────────────────────────────────────────────
  // isTagActive reads activeTags from the injected service. We write to the service
  // signal directly to set up the state — this is faster and more explicit than going
  // through the UI. Both the "not active" and "active" paths must work.
  describe('isTagActive', () => {

    it('returns false for a tag that is not active', () => {
      // No tags are active after component creation (effect resets activeTags).
      expect(component.isTagActive({ label: 'React', value: 'react' })).toBe(false);
    });

    it('returns true for a tag that is in activeTags', () => {
      // Write directly to the service's signal to simulate a tag being selected.
      component.projectService.activeTags.set(['react']);
      expect(component.isTagActive({ label: 'React', value: 'react' })).toBe(true);
    });
  });

  // ─── effect: service sync ──────────────────────────────────────────────────────────
  // The constructor effect tracks `this.stack()`. When it changes, the effect:
  //   a) writes the new stack to projectService.selectedStack
  //   b) clears projectService.activeTags
  // Both side-effects must occur, and detectChanges() is sufficient to flush them
  // because Angular's effect scheduler runs synchronously inside a TestBed tick.
  describe('effect: service sync on stack change', () => {

    it('updates selectedStack on the service when the stack input changes', () => {
      fixture.componentRef.setInput('stack', TechStack.frontend);
      fixture.detectChanges();
      expect(component.projectService.selectedStack()).toBe(TechStack.frontend);
    });

    // This prevents a subtle bug: if the user switches from "frontend" to "backend",
    // the previously-selected frontend tags must not carry over to the backend view.
    it('resets activeTags on the service when the stack input changes', () => {
      component.projectService.activeTags.set(['react']); // pre-populate some tags
      fixture.componentRef.setInput('stack', TechStack.backend);
      fixture.detectChanges();
      expect(component.projectService.activeTags()).toEqual([]);
    });
  });

  // ─── goBack ─────────────────────────────────────────────────────────────────────────
  // goBack() delegates to Angular's Location service, which handles both browser-history
  // navigation and testing environments (no real history required). We spy on the method
  // rather than asserting on URL changes because Location.back() is a command, not a query.
  describe('goBack', () => {
    it('calls Location.back()', () => {
      const backSpy = vi.spyOn(location, 'back');
      component.goBack();
      expect(backSpy).toHaveBeenCalledOnce();
    });
  });
});
