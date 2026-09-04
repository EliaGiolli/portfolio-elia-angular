import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <img 
      [src]="'assets/icons/' + name() + '.svg'" 
      [style.width.px]="size()" 
      [style.height.px]="size()"
      [attr.alt]="decorative() ? '' : (alt() || (name() + ' icon'))"
      [attr.aria-hidden]="decorative() ? 'true' : null"
      class="tech-tag"
    />
  `,
  styleUrls: ['./icon.css']
})
export class IconComponent {
  name = input.required<string>(); // es: 'angular', 'nodejs', 'github'
  size = input<number>(24);
  // When true the icon is purely decorative and should be hidden from Assistive Technology
  decorative = input<boolean>(false);
  // Optional explicit alt text (used when not decorative). If omitted a fallback is generated from the icon name.
  alt = input<string | undefined>();
}