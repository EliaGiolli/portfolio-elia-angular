import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [IconComponent],
  template: `
    <article class="custom-card" [attr.aria-label]="label() || null">
      <!-- Optional full-bleed banner above the header. Callers that project
           nothing here render exactly as before. -->
      <ng-content select="[card-cover]"></ng-content>

      <header class="card-header">
        @if (icon()) {
          <app-icon
            [name]="icon()!"
            [size]="iconSize()"
            tone="current"
            badge
            [decorative]="iconDecorative()"
          />
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
  /** Glyph size; the chip the card header draws around it adds 10px a side. */
  iconSize = input<number>(28);
  label = input<string | undefined>();
  /** Cards almost always have a visible title next to the icon, so the icon
   * is decorative by default. Set to false for the rare card whose icon is
   * the only label (e.g. an icon-only nav card with no visible heading). */
  iconDecorative = input<boolean>(true);
  get hasFooter() { return true; }
}