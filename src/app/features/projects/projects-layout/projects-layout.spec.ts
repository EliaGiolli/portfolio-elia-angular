import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsLayout } from './projects-layout';

describe('ProjectsLayout', () => {
  let component: ProjectsLayout;
  let fixture: ComponentFixture<ProjectsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
