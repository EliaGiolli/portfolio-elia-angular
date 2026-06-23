/**
 * Unit tests for ProjectsComponent (project detail view).
 *
 * WHY this file matters: this component is the destination after clicking any project
 * card. It bridges the URL (a string id parameter) to the data layer (a ProjectsTypes
 * object). Two things must be reliable:
 *
 *  1. The `project` computed signal — given an id, it must find the matching project in
 *     the service's projects array. A bug here renders an empty detail page or shows the
 *     wrong project.
 *
 *  2. The 404 guard effect — when the URL contains a non-empty id that maps to no known
 *     project, the component must navigate to /404 rather than rendering a broken page.
 *     Crucially, it must NOT navigate when the id is empty (component not yet bound by
 *     the router) or when the id is valid.
 *
 * Strategy: we mount the component with a real ProjectService (singleton data, no HTTP)
 * and a real Router configured with an empty route table (provideRouter([])). The Router
 * is needed because the template imports RouterLink and the component's effect calls
 * router.navigate(). We spy on navigate() with mockResolvedValue(true) to prevent actual
 * navigation and to allow assertion.
 *
 * For effect assertions we use `await fixture.whenStable()` after detectChanges(). This
 * gives Angular's effect scheduler time to run the effect inside the test's microtask
 * queue — no fakeAsync/tick needed (which would crash this project's Vitest setup).
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { ProjectsComponent } from './projects-component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    // Mock navigate() BEFORE detectChanges() so the initial effect run (id === '')
    // is already intercepted. mockResolvedValue(true) matches the real signature
    // (Router.navigate returns Promise<boolean>).
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── project computed ────────────────────────────────────────────────────────────────
  // We test the computed signal directly. The computed reads `id()` from the signal input
  // and searches service.projects(). All assertions are synchronous because signals
  // (unlike Observables) are always in sync with their dependencies.
  describe('project computed', () => {

    // id defaults to '' — an empty string converts to 0 via Number(''), and no project
    // has id 0, so the result must be undefined.
    it('is undefined when the id input is empty', () => {
      expect(component.project()).toBeUndefined();
    });

    // '1' → Number('1') = 1 → should find the first project in the dataset.
    it('returns the matching project for a valid id', () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();
      expect(component.project()).toBeDefined();
      expect(component.project()!.id).toBe(1);
    });

    // A very large id that does not exist: the find() call returns undefined.
    // Important: this does NOT test navigation — that is the effect's responsibility.
    it('is undefined when the id does not match any project', () => {
      fixture.componentRef.setInput('id', '9999');
      fixture.detectChanges();
      expect(component.project()).toBeUndefined();
    });
  });

  // ─── 404 navigation effect ───────────────────────────────────────────────────────────
  // The effect has three branches:
  //   if (id && project === undefined) → navigate to /404
  //   if (!id) → do nothing (not yet routed)
  //   if (project !== undefined) → do nothing (project exists)
  // We test all three to prevent regressions in any branch.
  describe('404 navigation effect', () => {

    // Positive case: non-empty id with no matching project → must redirect.
    // whenStable() ensures the effect has had a chance to run in the microtask queue.
    it('navigates to /404 when a non-empty id resolves to no project', async () => {
      fixture.componentRef.setInput('id', '9999');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(router.navigate).toHaveBeenCalledWith(['/404']);
    });

    // Guard case: empty id → the component is mounted but not yet bound to a route param.
    // Navigation must not fire; a false positive here would redirect the user on mount.
    it('does not navigate when the id is empty', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    // Happy-path case: id resolves to a real project → user should stay on the detail page.
    it('does not navigate when the id resolves to a valid project', async () => {
      fixture.componentRef.setInput('id', '1');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
