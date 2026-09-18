// shared/components/card-grid/card-grid.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  template: `
      <ul class="card-grid">
        <ng-content></ng-content>
      </ul>`,
  styleUrl: './card-grid.css',
})
export class CardGrid {}