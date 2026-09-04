import {
  Component,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { IconComponent } from '../../../shared/components/icon/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacts',
  imports: [ReactiveFormsModule, Button, IconComponent, RouterLink],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {
  isSubmitted = signal(false);
  isSubmitting = signal(false);

  contactsForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  get f() {
    return this.contactsForm.controls;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.contactsForm.invalid) {
      this.contactsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      this.contactsForm.reset();
    }, 1500);
  }
}
