import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [IconComponent],
  template: `
    <article class="custom-card" [attr.aria-label]="label() || null">
      <header class="card-header">
        @if (icon()) {
          <app-icon [name]="icon()!" [size]="iconSize()" [decorative]="iconDecorative()" />
        }
        <div class="header-content">
          <ng-content select="[card-header]"></ng-content>
        </div>
      </header>

      <div class="card-body">
        <ng-content select="[card-body]"></ng-content>
      </div>

      @if (hasFooter) {
        <footer class="card-footer">
          <ng-content select="[card-footer]"></ng-content>
        </footer>
      }
    </article>
  `,
  styleUrl: './card.css'
})
export class Card {
  icon = input<string>();
  iconSize = input<number>(56);
  label = input<string | undefined>();
  /** Cards almost always have a visible title next to the icon, so the icon
   * is decorative by default. Set to false for the rare card whose icon is
   * the only label (e.g. an icon-only nav card with no visible heading). */
  iconDecorative = input<boolean>(true);
  get hasFooter() { return true; }
}