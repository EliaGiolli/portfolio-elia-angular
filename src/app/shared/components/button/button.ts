import { Component, input, computed } from '@angular/core';
import { ButtonVariant } from '../../types/customComponentsTypes';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [type]="type()" [disabled]="disabled()">
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.css',
  // We apply the variant right to the hos element <app-button>
  host: {
    '[class]': 'variantClass()',
    '[class.disabled]': 'disabled()'
  }
})
export class Button {
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  href = input<string>()

  // We calculate the class based on the variant
  protected variantClass = computed(() => `btn-${this.variant()}`);
}