import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Homepage } from './homepage';

describe('Homepage', () => {
  let component: Homepage;
  let fixture: ComponentFixture<Homepage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homepage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Homepage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CV call to action', () => {
    it('downloads the PDF instead of navigating to a /cv route', () => {
      const cvLink: HTMLAnchorElement | undefined = Array.from(
        fixture.nativeElement.querySelectorAll('a'),
      ).find((a) => (a as HTMLAnchorElement).hasAttribute('download')) as
        | HTMLAnchorElement
        | undefined;

      expect(cvLink).toBeTruthy();
      expect(cvLink!.getAttribute('href')).toBe('/Elia_Giolli_CV_Angular_Developer.pdf');
    });

    it('has no link left pointing at the deleted /cv route', () => {
      const hrefs = Array.from(fixture.nativeElement.querySelectorAll('a')).map((a) =>
        (a as HTMLAnchorElement).getAttribute('href'),
      );

      expect(hrefs).not.toContain('/cv');
    });
  });
});
