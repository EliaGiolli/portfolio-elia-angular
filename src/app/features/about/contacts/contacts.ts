import {
  Component,
  inject,
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
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-contacts',
  imports: [ReactiveFormsModule, Button, IconComponent, RouterLink],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {
  private seo = inject(SeoService);

  isSubmitted = signal(false);
  isSubmitting = signal(false);

  constructor() {
    this.seo.update({
      title: 'Contact | Elia Giolli',
      description:
        'Get in touch with Elia Giolli about front-end or full-stack roles, freelance work, or collaboration on an Angular or Node.js project.',
      path: '/contacts'
    });
  }

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
