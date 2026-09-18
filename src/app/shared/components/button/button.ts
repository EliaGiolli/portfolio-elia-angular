import { Component, input, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ButtonVariant } from '../../types/customComponentsTypes';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <!--
      Projected content is declared ONCE, here, and stamped into whichever branch
      wins below.

      Angular resolves content projection statically, at compile time: a given
      <ng-content> claims the projected nodes, and a second <ng-content> in a
      sibling @if/@else branch renders empty. Putting one in each branch used to
      leave every href-based button as a bare <a></a> with no label and no icon.
    -->
    <ng-template #content><ng-content /></ng-template>

    @if (href(); as url) {
      <a
        [href]="url"
        [attr.download]="download()"
        [attr.target]="download() === undefined ? '_blank' : null"
        [attr.rel]="download() === undefined ? 'noopener noreferrer' : null"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </a>
    } @else {
      <button [type]="type()" [disabled]="disabled()">
        <ng-container [ngTemplateOutlet]="content" />
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
