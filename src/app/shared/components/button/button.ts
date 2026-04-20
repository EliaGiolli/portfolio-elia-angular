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
  // Applichiamo la variante direttamente all'elemento host <app-button>
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

  // Calcoliamo la classe CSS in base alla variante
  protected variantClass = computed(() => `btn-${this.variant()}`);
}