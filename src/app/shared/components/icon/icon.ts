import { Component, computed, input } from '@angular/core';
import { iconFolder } from '../../types/techMeta';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <img
      [src]="src()"
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

  /**
   * Icons are split across `tech/` and `miscellaneous/`, and the folder is derived
   * from the name rather than passed in — see TECH_ICONS in shared/types/techMeta.
   */
  protected src = computed(() => {
    const name = this.name().toLowerCase().trim();
    return `assets/icons/${iconFolder(name)}/${name}.svg`;
  });

  size = input<number>(24);
  // When true the icon is purely decorative and should be hidden from Assistive Technology
  decorative = input<boolean>(false);
  // Optional explicit alt text (used when not decorative). If omitted a fallback is generated from the icon name.
  alt = input<string | undefined>();
}