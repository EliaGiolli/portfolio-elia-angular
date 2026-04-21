import { 
  Component, 
  inject, 
  signal 
} from '@angular/core';
import { 
  FormsModule, 
  ReactiveFormsModule, 
  FormControl, 
  FormGroup,
  Validators 
} from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { IconComponent } from '../../../shared/components/icon/icon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-contacts',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    IconComponent,
    RouterLink
],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {

  // Signals to handle the feedback after the form submission
  isSubmitted = signal(false);
  isSubmitting = signal(false);

  contactsForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastName: new FormControl('',[Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    ])
  });

  textArea = new FormControl('', [Validators.required, Validators.minLength(10)]);

  onSubmit(event: Event) {

    event.preventDefault();

    if (this.contactsForm.invalid || this.textArea.invalid) {
      this.contactsForm.markAllAsTouched(); // It activates the UI error messages
      this.textArea.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      
      // Optional: reset the form after the submission
      this.contactsForm.reset();
      this.textArea.reset();
    }, 1500);
  }

  get f() {
    return this.contactsForm.controls;
  }
}