import { booleanAttribute, Component, computed, input } from '@angular/core';
import { iconFolder, techLabel } from '../../types/techMeta';

/**
 * Renders one SVG from `assets/icons/`.
 *
 * Two things are deliberate here and worth reading before changing them:
 *
 * - `size` is the size of the *glyph*. The circular chip some call sites want is
 *   opt-in via `badge` and grows around the glyph, on the host. It used to be
 *   padding on the <img> itself, which — with the global `box-sizing: border-box` —
 *   subtracted 22px from every icon: `[size]="20"` rendered a 0px glyph inside an
 *   empty chip, and `[size]="52"` rendered 30px.
 *
 * - `tone` picks the rendering technique. Brand marks (`angular`, `github`,
 *   `linkedin`) carry their own colours, so they render as an <img>. UI glyphs
 *   (the Lucide set: arrows, download, menu) are stroked with `currentColor`,
 *   which an <img> cannot inherit — inside a blue button they came out black. Those
 *   render as a masked <span> instead, so they take the colour of the surrounding
 *   text for free. Same technique as `.card-cover__mark` in projects-component.css.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    @if (tone() === 'current') {
      <span
        class="glyph glyph--mask"
        [style.width.px]="size()"
        [style.height.px]="size()"
        [style.mask-image]="maskUrl()"
        [style.-webkit-mask-image]="maskUrl()"
        [attr.role]="decorative() ? null : 'img'"
        [attr.aria-label]="decorative() ? null : label()"
        [attr.aria-hidden]="decorative() ? 'true' : null"
      ></span>
    } @else {
      <img
        class="glyph"
        [src]="src()"
        [style.width.px]="size()"
        [style.height.px]="size()"
        [attr.alt]="decorative() ? '' : label()"
        [attr.aria-hidden]="decorative() ? 'true' : null"
      />
    }
  `,
  styleUrls: ['./icon.css'],
  host: {
    '[class.is-badge]': 'badge()',
  },
})
export class IconComponent {
  name = input.required<string>(); // es: 'angular', 'nodedotjs', 'github'

  /** Size of the glyph in px. With `badge`, the chip is this plus its padding. */
  size = input<number>(24);

  /**
   * `brand` keeps the asset's own colours (an <img>); `current` repaints the glyph
   * with the inherited `color`, for UI icons that sit inside buttons and links.
   */
  tone = input<'brand' | 'current'>('brand');

  /**
   * Wraps the glyph in the circular chip used by the tech rows and social links.
   * `booleanAttribute` so call sites can write a bare `badge`.
   */
  badge = input<boolean, unknown>(false, { transform: booleanAttribute });

  // When true the icon is purely decorative and should be hidden from Assistive Technology
  decorative = input<boolean>(false);
  // Optional explicit alt text (used when not decorative). If omitted a fallback is generated from the icon name.
  alt = input<string | undefined>();

  /**
   * Icons are split across `tech/` and `miscellaneous/`, and the folder is derived
   * from the name rather than passed in — see TECH_ICONS in shared/types/techMeta.
   */
  protected src = computed(() => {
    const name = this.name().toLowerCase().trim();
    return `assets/icons/${iconFolder(name)}/${name}.svg`;
  });

  /**
   * Root-relative on purpose: a mask `url()` in a style attribute resolves against
   * the document, not against `<base href>`, so the bare `assets/…` the <img> uses
   * would 404 on a nested route like `/projects/frontend/2`.
   */
  protected maskUrl = computed(() => `url("/${this.src()}")`);

  protected label = computed(() => this.alt() || `${techLabel(this.name())} icon`);
}
