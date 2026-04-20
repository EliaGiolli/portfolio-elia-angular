import { Directive, ViewContainerRef, input, HostListener, ComponentRef } from '@angular/core';
import { TechTooltip } from '../../shared/components/tooltip/tooltip';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  // Il nome della tech passato dalla direttiva
  appTooltip = input.required<string>();

  private componentRef: ComponentRef<TechTooltip> | null = null;

  constructor(private vcr: ViewContainerRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.componentRef) return;

    // 1. Creiamo il componente dinamicamente come nel video
    this.componentRef = this.vcr.createComponent(TechTooltip);

    // 2. Passiamo il nome tramite il metodo setInput (essenziale per i Signal Inputs)
    this.componentRef.setInput('techName', this.appTooltip());
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    // 3. Distruggiamo il componente quando il mouse esce
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}