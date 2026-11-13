import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactComponent } from './contacts';

describe('ContactComponent (Signal Forms & Zod)', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form model and invalid form state', () => {
    expect(component.contactsModel()).toEqual({
      name: '',
      email: '',
      message: '',
      privacyAccepted: false,
    });

    // Form should initially be invalid
    expect(component.formValidationResult().isValid).toBe(false);
    expect(component.contactForm().valid()).toBe(false);
  });

  it('should invalidate the form and populate field errors when requirements are not met', () => {
    component.contactsModel.set({
      name: 'A', // Too short (min 2)
      email: 'invalid-email', // Invalid email
      message: 'Short', // Too short (min 10)
      privacyAccepted: false, // Not accepted
    });
    fixture.detectChanges();

    const validation = component.formValidationResult();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toBeTruthy();

    expect(component.contactForm().valid()).toBe(false);
    expect(component.contactForm.name().errors().length).toBeGreaterThan(0);
    expect(component.contactForm.name().errors()[0].message).toBe('Name must be at least 2 characters');
    expect(component.contactForm.email().errors()[0].message).toBe('Please enter a valid email address');
    expect(component.contactForm.message().errors()[0].message).toBe('Message must be at least 10 characters');
    expect(component.contactForm.privacyAccepted().errors()[0].message).toBe('You must accept the privacy policy to continue');
  });

  it('should validate successfully when all fields meet Zod criteria', () => {
    component.contactsModel.set({
      name: 'Elia Giolli',
      email: 'elia@example.com',
      message: 'This is a sufficiently long test message.',
      privacyAccepted: true,
    });
    fixture.detectChanges();

    const validation = component.formValidationResult();
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toBeNull();
    expect(component.contactForm().valid()).toBe(true);
  });

  it('should not submit if validation fails, touch fields, and display errorMessage banner', async () => {
    // Submit with empty fields
    await component.onSubmit();
    fixture.detectChanges();

    expect(component.successMessage()).toBeNull();
    expect(component.errorMessage()).toBe('Please fix the errors below before submitting.');
    // submit() automatically touches all fields so inline errors become visible
    expect(component.contactForm.name().touched()).toBe(true);
    expect(component.contactForm.email().touched()).toBe(true);
    expect(component.contactForm.message().touched()).toBe(true);
    expect(component.contactForm.privacyAccepted().touched()).toBe(true);
  });

  it('should simulate successful submission, reset the form, and set success message after async timeout', async () => {
    component.contactsModel.set({
      name: 'Elia Giolli',
      email: 'elia@example.com',
      message: 'This is a valid test message for submission.',
      privacyAccepted: true,
    });
    fixture.detectChanges();

    // Trigger submit
    const submitPromise = component.onSubmit();

    // Not yet set immediately
    expect(component.successMessage()).toBeNull();
    expect(component.errorMessage()).toBeNull();

    await submitPromise;
    fixture.detectChanges();

    expect(component.successMessage()).toContain('Message successfully sent!');
    expect(component.contactsModel()).toEqual({
      name: '',
      email: '',
      message: '',
      privacyAccepted: false,
    });
  });

  it('should handle native form submit event via FormRoot directive without error', async () => {
    const formElement: HTMLFormElement = fixture.nativeElement.querySelector('form');
    expect(formElement).toBeTruthy();

    formElement.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(component.errorMessage()).toBe('Please fix the errors below before submitting.');
    expect(component.contactForm.name().touched()).toBe(true);
  });
});
