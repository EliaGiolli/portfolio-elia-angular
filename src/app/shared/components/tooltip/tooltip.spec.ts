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
    // `techName` is input.required, so it must be set before change detection runs.
    fixture.componentRef.setInput('techName', 'Angular');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
