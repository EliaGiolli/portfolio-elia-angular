// shared/components/section/section.ts
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-about-section',
  standalone: true,
  template: `
    <section [id]="id()" [attr.aria-labelledby]="headingId()">
      @if (eyebrow(); as e) {
        <p class="section-eyebrow">{{ e }}</p>
      }
      <h2 [id]="headingId()">{{ title() }}</h2>
      <ng-content></ng-content>
    </section>
  `,
  styleUrl: './about-section.css',
})
export class AboutSection {
  /** Also usable as an in-page anchor, e.g. /about#skills */
  id = input.required<string>();
  title = input.required<string>();
  eyebrow = input<string>();

  headingId = computed(() => `${this.id()}-heading`);
}