/**
 * Unit tests for the Button component.
 *
 * WHY this file matters: Button is the primary interactive element across the entire
 * portfolio (navigation, project links, form submission). Its correctness has two
 * dimensions that are easy to break independently:
 *
 *  1. Visual contracts — the host-class binding `[class]="variantClass()"` must produce
 *     the right CSS class on the <app-button> element so that the design system styles
 *     apply. A typo in the computed string ("btn_primary" instead of "btn-primary") would
 *     render unstyled buttons across the whole app.
 *
 *  2. Accessibility / behaviour contracts — the native <button> inside the template must
 *     inherit the correct `disabled` and `type` attributes. If `disabled` does not
 *     propagate to the inner element, keyboard users can still activate a "disabled" button
 *     and form submissions can fire unexpectedly.
 *
 * Strategy: use ComponentFixture to mount the real DOM and inspect `nativeElement`
 * properties directly, bypassing Angular's rendering abstractions — this confirms what
 * the browser (and screen readers) actually see.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    // detectChanges() triggers the first change-detection cycle so computed signals
    // (variantClass) are evaluated and host bindings are applied to the DOM.
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── variant class ──────────────────────────────────────────────────────────────────
  // The class is applied to the host element (<app-button>) via a host binding, not to the
  // inner <button>. We check nativeElement.classList — the outer custom element — because
  // that is what CSS rules target in the stylesheets.
  describe('variant class', () => {

    // Default case: no input supplied → component defaults to 'primary' → class 'btn-primary'.
    it('applies btn-primary on the host by default', () => {
      expect(fixture.nativeElement.classList).toContain('btn-primary');
    });

    // For each non-default variant we call setInput() (the Angular 16+ API for signal
    // inputs) and re-run detectChanges() so the computed variantClass re-evaluates.
    it('applies btn-secondary when variant is secondary', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('btn-secondary');
    });

    it('applies btn-outline when variant is outline', () => {
      fixture.componentRef.setInput('variant', 'outline');
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('btn-outline');
    });

    it('applies btn-ghost when variant is ghost', () => {
      fixture.componentRef.setInput('variant', 'ghost');
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('btn-ghost');
    });
  });

  // ─── disabled state ─────────────────────────────────────────────────────────────────
  // Two separate concerns require separate assertions:
  //   a) The host element gains the `.disabled` CSS class (used for visual styling).
  //   b) The inner <button> has its native `disabled` property set (used by the browser
  //      and by assistive technology to prevent interaction).
  // Both must work together — a visually-disabled but functionally-enabled button is a
  // significant accessibility defect.
  describe('disabled state', () => {

    it('does not have the disabled class by default', () => {
      expect(fixture.nativeElement.classList).not.toContain('disabled');
    });

    it('adds the disabled class to the host when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain('disabled');
    });

    it('disables the inner button element when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.disabled).toBe(true);
    });

    it('inner button is not disabled by default', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.disabled).toBe(false);
    });
  });

  // ─── type attribute ─────────────────────────────────────────────────────────────────
  // The `type` input maps directly to the HTML attribute. The default MUST be 'button'
  // (not 'submit') — a button inside a form without an explicit type defaults to 'submit'
  // in browsers, which can trigger unintended form submissions. We verify the default and
  // both override values.
  describe('type attribute', () => {

    it('sets type to button by default', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.type).toBe('button');
    });

    it('sets type to submit when input is submit', () => {
      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.type).toBe('submit');
    });

    it('sets type to reset when input is reset', () => {
      fixture.componentRef.setInput('type', 'reset');
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.type).toBe('reset');
    });
  });
});
