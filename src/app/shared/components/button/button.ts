import { Component, input, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, type Params } from '@angular/router';
import { ButtonSize, ButtonVariant } from '../../types/customComponentsTypes';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink],
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

    @if (link(); as commands) {
      <a
        [routerLink]="commands"
        [fragment]="fragment()"
        [queryParams]="queryParams()"
        [attr.aria-label]="ariaLabel()"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </a>
    } @else if (href(); as url) {
      <a
        [href]="url"
        [attr.download]="download()"
        [attr.target]="download() === undefined ? '_blank' : null"
        [attr.rel]="download() === undefined ? 'noopener noreferrer' : null"
        [attr.aria-label]="ariaLabel()"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </a>
    } @else {
      <button [type]="type()" [disabled]="disabled()" [attr.aria-label]="ariaLabel()">
        <ng-container [ngTemplateOutlet]="content" />
      </button>
    }
  `,
  styleUrl: './button.css',
  host: {
    '[class]': 'variantClass()',
    '[class.btn-sm]': 'size() === "sm"',
    '[class.disabled]': 'disabled()',
  },
})
export class Button {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);

  /**
   * Internal navigation: renders a real `<a routerLink>` inside the component.
   *
   * Don't put `routerLink` on `<app-button>` itself. That makes the host element
   * clickable around an inner `<button>`: two tab stops, and the button role on
   * something that navigates.
   */
  link = input<string | readonly unknown[]>();
  /** Used with `link`, e.g. `link="/" fragment="contact"` for an in-page section. */
  fragment = input<string>();
  /** Used with `link`. */
  queryParams = input<Params>();

  /** External URL or file. Opens in a new tab unless `download` is set. */
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

  /**
   * Accessible name for the inner control. Required for `variant="icon"`, where the
   * only content is a decorative icon. An `aria-label` on the `<app-button>` host
   * would name a generic element that screen readers ignore.
   */
  ariaLabel = input<string>();

  protected variantClass = computed(() => `btn-${this.variant()}`);
}
