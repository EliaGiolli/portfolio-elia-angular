import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon'; // Assicurati che il percorso sia corretto

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [IconComponent],
  template: `
    <article class="custom-card" role="article" [attr.aria-label]="label() || null">
      <header class="card-header">
        @if (icon()) {
          <app-icon [name]="icon()!" [size]="iconSize()" />
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
  iconSize = input<number>(45);
  // Optional label used for accessibility. When provided it is applied as `aria-label` on the article.
  label = input<string | undefined>();
  // Getter to hide the padding from the footer (optional)
  get hasFooter() { return true; } 
}