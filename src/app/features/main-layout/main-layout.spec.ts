import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MainLayoutComponent } from './main-layout';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('provides exactly one <main> for the whole app', () => {
    expect(fixture.nativeElement.querySelectorAll('main').length).toBe(1);
  });

  it('wires the skip link to the main region', () => {
    const skip = fixture.nativeElement.querySelector('.skip-link') as HTMLAnchorElement;
    const main = fixture.nativeElement.querySelector('main') as HTMLElement;

    expect(skip.getAttribute('href')).toBe('#content');
    expect(main.id).toBe('content');
    // Without tabindex the fragment jump scrolls but never moves focus.
    expect(main.getAttribute('tabindex')).toBe('-1');
  });
});
