/**
 * Unit tests for TooltipDirective.
 *
 * WHY this file matters: TooltipDirective is the only directive in the app and it uses
 * one of Angular's most advanced APIs — ViewContainerRef.createComponent() — to
 * dynamically insert a TechTooltip component into the DOM on mouseenter and remove it on
 * mouseleave. This pattern is easy to break:
 *
 *  - Forgetting the null-check guard creates duplicate tooltips on repeated hovers.
 *  - Failing to call destroy() on mouseleave leaks component instances.
 *  - Passing the wrong value to setInput() would render an empty or incorrect label.
 *
 * Strategy: because directives cannot be tested in isolation (they need a host element),
 * we declare a minimal HostComponent that applies the directive and serves as the test
 * fixture. We then dispatch real MouseEvent objects to the host's DOM element, which
 * triggers Angular's @HostListener handlers, and assert on the DOM to confirm that
 * TechTooltip appears and disappears correctly.
 *
 * Note on querying: we use fixture.nativeElement.querySelector('app-tech-tooltip') rather
 * than By.directive(TechTooltip) because the dynamically-created component is inserted
 * into the ViewContainerRef ADJACENT to the host element, so it lives in the host's DOM
 * subtree and can be found via querySelector.
 */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipDirective } from './tooltip.directive';

// Minimal host component: gives the directive a real DOM element to attach to and
// provides a techName value that we can assert is correctly forwarded to TechTooltip.
@Component({
  standalone: true,
  imports: [TooltipDirective],
  template: `<span [appTooltip]="techName"></span>`,
})
class HostComponent {
  techName = 'React';
}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let hostEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    // Grab the <span> that carries the [appTooltip] binding — this is the element we
    // will dispatch mouse events to.
    hostEl = fixture.nativeElement.querySelector('span');
  });

  // Smoke test: confirms the directive was instantiated and injected correctly.
  // We retrieve the directive instance via the debug element's injector (the DI node
  // associated with the element that carries the directive selector).
  it('attaches to the host element without error', () => {
    const directive = fixture.debugElement
      .query(By.directive(TooltipDirective))
      .injector.get(TooltipDirective);
    expect(directive).toBeTruthy();
  });

  // mouseenter → createComponent() should insert <app-tech-tooltip> into the DOM.
  // detectChanges() after the event gives Angular a chance to render the new component.
  it('creates app-tech-tooltip on mouseenter', () => {
    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    const tooltip = fixture.nativeElement.querySelector('app-tech-tooltip');
    expect(tooltip).not.toBeNull();
  });

  // mouseleave → destroy() should remove the component instance and its DOM node.
  // If this fails, old tooltips accumulate as ghost elements in the document.
  it('removes app-tech-tooltip on mouseleave', () => {
    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    hostEl.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    const tooltip = fixture.nativeElement.querySelector('app-tech-tooltip');
    expect(tooltip).toBeNull();
  });

  // The directive guards against duplicate creation with `if (this.componentRef) return`.
  // We fire mouseenter twice without an intervening mouseleave to confirm only one
  // tooltip is ever in the DOM at a time.
  it('does not create duplicate tooltips on repeated mouseenter', () => {
    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    hostEl.dispatchEvent(new MouseEvent('mouseenter')); // second event should be a no-op
    fixture.detectChanges();
    const tooltips = fixture.nativeElement.querySelectorAll('app-tech-tooltip');
    expect(tooltips.length).toBe(1);
  });

  // Confirms that the directive correctly forwards the bound value ('React') to the
  // TechTooltip component via setInput(). If the wrong value (or no value) were passed,
  // the tooltip would render blank or with a stale label.
  it('passes the techName to the tooltip component', () => {
    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    const tooltip = fixture.nativeElement.querySelector('app-tech-tooltip');
    expect(tooltip.textContent.trim()).toBe('React');
  });
});
