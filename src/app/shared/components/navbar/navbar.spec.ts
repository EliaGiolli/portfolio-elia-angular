/**
 * Unit tests for the Navbar component.
 *
 * WHY this file matters: the Navbar contains the only navigation in the portfolio. On
 * mobile viewports it relies on a toggle signal (isMenuOpen) to show or hide the nav
 * links. If that toggle breaks — or if the signal is initialised in the wrong state —
 * mobile visitors have no way to reach other pages.
 *
 * Strategy: we test the signal behaviour directly on the component class rather than
 * querying the template for visibility, because the component itself drives the state.
 * Template rendering is implicitly covered: if the signal is wrong, the template is wrong.
 *
 * provideRouter([]) is required because Navbar imports RouterLink and RouterLinkActive
 * from @angular/router. Even though we do not navigate anywhere in these tests, Angular
 * needs an active Router instance to compile those directives without throwing.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── isMenuOpen signal ──────────────────────────────────────────────────────────────
  describe('isMenuOpen', () => {

    // The menu must start CLOSED. If it defaulted to true the nav links would be
    // unconditionally visible on mobile and the toggle icon would render incorrectly.
    it('is false by default', () => {
      expect(component.isMenuOpen()).toBe(false);
    });

    // First toggle: closed → open. Verifies the signal actually changes on method call.
    it('becomes true after toggleMenu is called once', () => {
      component.toggleMenu();
      expect(component.isMenuOpen()).toBe(true);
    });

    // Second toggle: open → closed. A real user taps the hamburger icon once to open
    // the menu and taps it again to close it. Both transitions must work.
    it('returns to false after toggleMenu is called twice', () => {
      component.toggleMenu();
      component.toggleMenu();
      expect(component.isMenuOpen()).toBe(false);
    });
  });

  // The template uses these string constants to select which SVG icon to render
  // (hamburger vs. X). If the strings are ever changed the icons break silently.
  it('exposes the correct icon name constants', () => {
    expect(component.MENU_ICON).toBe('menu');
    expect(component.CLOSE_ICON).toBe('x');
  });
});
