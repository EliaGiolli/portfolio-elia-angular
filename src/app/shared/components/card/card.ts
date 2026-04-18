import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <article class="custom-card">
      <header class="card-header">
        <ng-content select="[card-header]"></ng-content>
      </header>

      <div class="card-body">
        <ng-content select="[card-body]"></ng-content>
      </div>

      <footer class="card-footer">
        <ng-content select="[card-footer]"></ng-content>
      </footer>
    </article>
  `,
  styleUrl: './card.css'
})
export class Card {}