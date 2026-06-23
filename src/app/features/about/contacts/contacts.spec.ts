/**
 * Unit tests for the Contacts component.
 *
 * WHY this file matters: the contacts form is the only way a recruiter or visitor can
 * reach out directly from the portfolio. Two things must not break:
 *
 *  1. Validation rules — each field has specific constraints (minLength, email format).
 *     If a rule is removed or misconfigured, invalid data can be submitted; if a rule
 *     is accidentally tightened, valid data is rejected and users see a broken form.
 *
 *  2. Submission flow — on a valid submit the form must show a "submitting" state, wait
 *     1500 ms, then mark itself as submitted and reset. If any step is skipped the user
 *     gets no visual feedback and the form may remain filled with stale data.
 *
 * Strategy: we test validation rules on the reactive FormGroup controls directly
 * (no DOM clicks needed — Angular validators run synchronously). For the async flow we
 * mock globalThis.setTimeout, capture the callback, and invoke it manually. This lets
 * us test the callback's effects without fakeAsync (which causes worker crashes in this
 * project's Vitest + Angular 21 setup due to Zone.js not being configured for the new
 * test builder) and without a real 1500 ms wait.
 *
 * provideRouter([]) is required because the template imports RouterLink for the "back"
 * navigation anchor.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Contacts } from './contacts';

describe('Contacts', () => {
  let component: Contacts;
  let fixture: ComponentFixture<Contacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contacts],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Contacts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── form validation ────────────────────────────────────────────────────────────────
  // We test Angular reactive form validators, not DOM events. This gives us precise
  // control: we set exactly the value we want to trigger a specific error, then assert
  // on the FormControl's error map. No need to simulate user typing.
  describe('form validation', () => {

    // Baseline: the form starts with all controls empty and all Validators.required
    // active, so the group must be invalid before the user touches anything.
    it('form is invalid when all fields are empty', () => {
      expect(component.contactsForm.invalid).toBe(true);
    });

    // 'ab' has length 2, which is below the minLength(4) constraint → error must exist.
    it('name field is invalid with fewer than 4 characters', () => {
      component.f['name'].setValue('ab');
      expect(component.f['name'].hasError('minlength')).toBe(true);
    });

    // Exact boundary: 4 characters is the minimum → should be valid.
    it('name field is valid with 4 or more characters', () => {
      component.f['name'].setValue('John');
      expect(component.f['name'].valid).toBe(true);
    });

    it('lastName field is invalid with fewer than 4 characters', () => {
      component.f['lastName'].setValue('Do');
      expect(component.f['lastName'].hasError('minlength')).toBe(true);
    });

    // Angular's Validators.email rejects strings that lack an @ and a domain part.
    it('email field is invalid for a non-email string', () => {
      component.f['email'].setValue('not-an-email');
      expect(component.f['email'].hasError('email')).toBe(true);
    });

    it('email field is valid for a correct email address', () => {
      component.f['email'].setValue('user@example.com');
      expect(component.f['email'].valid).toBe(true);
    });

    // 'Too short' is 9 characters, one below the minLength(10) threshold.
    it('message field is invalid with fewer than 10 characters', () => {
      component.f['message'].setValue('Too short');
      expect(component.f['message'].hasError('minlength')).toBe(true);
    });

    // Integration: only when ALL four fields meet their constraints is the group valid.
    it('form is valid when all fields satisfy the constraints', () => {
      fillValidForm();
      expect(component.contactsForm.valid).toBe(true);
    });
  });

  // ─── onSubmit — invalid form ─────────────────────────────────────────────────────────
  // We simulate submission without filling the form to test the guard branch.
  // The event object is a plain stub: we only need preventDefault() to exist (the
  // component calls it at the start of onSubmit to stop native form submission).
  describe('onSubmit — invalid form', () => {

    // Angular only shows validation error messages on touched controls. Submitting with
    // an invalid form must call markAllAsTouched() so the template can display errors
    // immediately, without requiring the user to focus every field one by one.
    it('marks all fields as touched so errors become visible', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      component.onSubmit(event);
      expect(component.contactsForm.touched).toBe(true);
    });

    // isSubmitting drives the loading spinner in the template. It must NOT be set when
    // the form is invalid — setting it would show a spinner with no real request.
    it('does not set isSubmitting', () => {
      const event = { preventDefault: vi.fn() } as unknown as Event;
      component.onSubmit(event);
      expect(component.isSubmitting()).toBe(false);
    });
  });

  // ─── onSubmit — valid form ────────────────────────────────────────────────────────────
  describe('onSubmit — valid form', () => {

    // Immediately after a valid submit the component sets isSubmitting = true to give
    // the user instant feedback (e.g. a disabled submit button or a spinner).
    it('sets isSubmitting to true immediately', () => {
      fillValidForm();
      const event = { preventDefault: vi.fn() } as unknown as Event;
      component.onSubmit(event);
      expect(component.isSubmitting()).toBe(true);
    });

    /**
     * Tests the full submission lifecycle in a single focused test.
     *
     * Why setTimeout mock instead of fakeAsync/tick:
     * The @angular/build:unit-test builder (Angular 21 + Vitest) does not include
     * zone.js/testing in its default setup, so Angular's fakeAsync causes worker crashes.
     * Instead we intercept globalThis.setTimeout before the component calls it, capture
     * the callback reference, and invoke it manually after asserting the pre-callback state.
     * This is equivalent to calling tick(1500) but works without Zone.js.
     */
    it('clears isSubmitting, sets isSubmitted, and resets the form after 1500 ms', () => {
      let capturedCallback: (() => void) | undefined;
      vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn: any) => {
        capturedCallback = fn;
        return 0 as unknown as ReturnType<typeof setTimeout>;
      });

      fillValidForm();
      const event = { preventDefault: vi.fn() } as unknown as Event;
      component.onSubmit(event);

      // Pre-callback state: spinner is active, form is not yet submitted.
      expect(component.isSubmitting()).toBe(true);

      // Simulate the 1500 ms elapsing by running the captured callback directly.
      capturedCallback!();

      // Post-callback state: spinner gone, confirmation signal set, form cleared.
      expect(component.isSubmitting()).toBe(false);
      expect(component.isSubmitted()).toBe(true);
      expect(component.contactsForm.value.name).toBeNull(); // reset() nulls controls

      vi.restoreAllMocks();
    });
  });

  // ─── helpers ─────────────────────────────────────────────────────────────────────────
  // Shared helper used by multiple "valid form" tests to avoid duplicating the four
  // setValue calls. Kept as a plain function (not a beforeEach) so only tests that
  // need a filled form pay the cost.
  function fillValidForm() {
    component.f['name'].setValue('John');
    component.f['lastName'].setValue('Doee');
    component.f['email'].setValue('john@example.com');
    component.f['message'].setValue('Hello, this is a long enough message for testing.');
  }
});
