/**
 * Unit tests for TechTooltip.
 *
 * WHY this file matters: TechTooltip is the display layer for the technology name shown
 * when hovering over a stack icon. It is always created DYNAMICALLY by TooltipDirective
 * via ViewContainerRef.createComponent(), never declared statically in a template. This
 * means the component never gets a standard Angular template compilation path, and a bug
 * in its standalone template (e.g. the wrong CSS class selector or a broken binding)
 * would not surface until a real user interaction occurs.
 *
 * Testing TechTooltip in isolation also ensures that if the directive test ever changes
 * (e.g. mocking the component), we still have a pure unit test that locks in the
 * component's own rendering contract.
 *
 * Strategy: mount TechTooltip directly with TestBed using setInput() to provide the
 * required `techName` signal input, then assert on the DOM text content.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechTooltip } from './tooltip';

describe('TechTooltip', () => {
  let component: TechTooltip;
  let fixture: ComponentFixture<TechTooltip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechTooltip],
    }).compileComponents();

    fixture = TestBed.createComponent(TechTooltip);
    component = fixture.componentInstance;
    // `techName` is a required signal input — setInput() must be called before
    // detectChanges() to avoid a "required input not set" runtime error.
    fixture.componentRef.setInput('techName', 'React');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // The tooltip must display the tech name inside .tooltip-box. We trim whitespace
  // because Angular's template interpolation (`{{ techName() }}`) emits surrounding
  // spaces that are part of the rendered text node.
  it('renders the techName in the tooltip box', () => {
    const box: HTMLElement = fixture.nativeElement.querySelector('.tooltip-box');
    expect(box.textContent?.trim()).toBe('React');
  });

  // Reactivity check: if the directive updates the techName input after creation
  // (e.g. user quickly moves between two different icons), the displayed text must
  // update without destroying and recreating the component.
  it('updates the displayed text when techName changes', () => {
    fixture.componentRef.setInput('techName', 'TypeScript');
    fixture.detectChanges();
    const box: HTMLElement = fixture.nativeElement.querySelector('.tooltip-box');
    expect(box.textContent?.trim()).toBe('TypeScript');
  });
});
