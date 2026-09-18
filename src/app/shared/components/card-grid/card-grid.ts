// shared/components/card-grid/card-grid.ts
import { Component, input } from '@angular/core';

/**
 * Responsive grid of cards. Renders a <ul>, so callers project <li> elements:
 *
 *   <app-card-grid>
 *     @for (item of items(); track item.id) {
 *       <li><app-card ...></app-card></li>
 *     }
 *   </app-card-grid>
 *
 * The two inputs are forwarded to CSS custom properties on the host rather than
 * interpolated into the stylesheet, so call sites can tune the layout without
 * this component knowing anything about them.
 */
@Component({
  selector: 'app-card-grid',
  standalone: true,
  template: `
      <ul class="card-grid">
        <ng-content></ng-content>
      </ul>`,
  styleUrl: './card-grid.css',
  host: {
    '[style.--card-grid-min]': 'minColumnWidth()',
    '[style.--card-grid-gap]': 'gap()',
  },
})
export class CardGrid {
  /** Minimum track width before the grid drops to fewer columns. */
  minColumnWidth = input<string>('260px');
  /** Gap between cards, in any valid CSS length. */
  gap = input<string>('var(--space-4)');
}
