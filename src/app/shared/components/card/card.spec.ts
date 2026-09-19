import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card } from './card';

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders no cover region when the caller projects none', () => {
    // /about composes app-card without a cover; it must stay exactly as it was.
    expect(fixture.nativeElement.querySelector('[card-cover]')).toBeNull();
  });
});
