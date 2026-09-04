import { Directive, ViewContainerRef, input, HostListener, ComponentRef } from '@angular/core';
import { TechTooltip } from '../../shared/components/tooltip/tooltip';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {

  appTooltip = input.required<string>();

  private componentRef: ComponentRef<TechTooltip> | null = null;

  constructor(private vcr: ViewContainerRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.componentRef) return;

    // 1. The component is created dynamically
    this.componentRef = this.vcr.createComponent(TechTooltip);

    // 2. the name is passed with the setInput method, required for the Signal Input
    this.componentRef.setInput('techName', this.appTooltip());
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    // 3. The component is destroyed when the mouse leaves
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}