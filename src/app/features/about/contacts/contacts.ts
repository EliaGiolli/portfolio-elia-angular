import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, FormField, FormRoot, validateStandardSchema, submit } from '@angular/forms/signals';
import { Button } from '../../../shared/components/button/button';
import { contactSchema, ContactFormModel } from './formSchema';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormField, FormRoot, Button],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css'
})
export class ContactComponent {
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  contactsModel = signal<ContactFormModel>({
    name: '',
    email: '',
    message: '',
    privacyAccepted: false
  });

  // Signal Form with Zod validation and submission options
  contactForm = form(
    this.contactsModel,
    (path) => {
      validateStandardSchema(path, contactSchema);
    },
    {
      submission: {
        action: async () => {
          this.errorMessage.set(null);
          // Here the async API call would happen (e.g. HttpClient)
          await new Promise((resolve) => setTimeout(resolve, 1500));
          this.successMessage.set('Message successfully sent! We will contact you soon.');
          this.contactsModel.set({
            name: '',
            email: '',
            message: '',
            privacyAccepted: false
          });
        },
        onInvalid: () => {
          this.errorMessage.set('Please fix the errors below before submitting.');
        }
      }
    }
  );

  // Computed validation state for backwards compatibility / direct checking
  formValidationResult = computed(() => {
    const rawValue = this.contactsModel();
    const result = contactSchema.safeParse(rawValue);

    if (result.success) {
      return { isValid: true, errors: null };
    }

    return {
      isValid: false,
      errors: result.error.format()
    };
  });

  onSubmit() {
    this.errorMessage.set(null);
    return submit(this.contactForm);
  }
}