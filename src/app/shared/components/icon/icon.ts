import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <img 
      [src]="'assets/icons/' + name() + '.svg'" 
      [style.width.px]="size()" 
      [style.height.px]="size()"
      [alt]="name() + ' icon'"
      class="tech-tag"
    />
  `,
  styleUrls: ['./icon.css']
})
export class IconComponent {
  name = input.required<string>(); // es: 'angular', 'nodejs', 'github'
  size = input<number>(24);
}