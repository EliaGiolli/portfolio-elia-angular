import { Component, input, computed } from '@angular/core';
import { ButtonVariant } from '../../types/customComponentsTypes';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    @if (href(); as url) {
      <a
        [href]="url"
        [attr.download]="download()"
        [attr.target]="download() === undefined ? '_blank' : null"
        [attr.rel]="download() === undefined ? 'noopener noreferrer' : null"
      >
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
  /**
   * Turns an `href` into a download instead of a navigation. Pass `""` to keep the
   * file's own name, or a string to rename it on save.
   *
   * Setting this also drops `target="_blank"`: combined with `download`, some browsers
   * open a tab that immediately closes. Leaving it unset keeps the existing
   * new-tab-with-noopener behaviour for ordinary external links.
   */
  download = input<string>();

  protected variantClass = computed(() => `btn-${this.variant()}`);
}