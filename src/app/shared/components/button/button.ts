import { Component, input, computed } from '@angular/core';
import { ButtonVariant } from '../../types/customComponentsTypes';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    @if (href(); as url) {
      <a [href]="url" target="_blank" rel="noopener noreferrer">
        <ng-content />
      </a>
    } @else {
      <button [type]="type()" [disabled]="disabled()">
        <ng-content />
      </button>
    }
  `,
  styleUrl: './button.css',
  host: {
    '[class]': 'variantClass()',
    '[class.disabled]': 'disabled()',
  },
})
export class Button {
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  href = input<string>();

  protected variantClass = computed(() => `btn-${this.variant()}`);
}