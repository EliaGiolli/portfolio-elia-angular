import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProjectsComponent } from './projects-component';
import { ProjectService } from '../../../core/services/project-service.service';
import { ProjectsTypes, TechStack } from '../../../shared/types/projects';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('long-form case-study content', () => {
    const render = async (id: string) => {
      fixture.componentRef.setInput('id', id);
      await fixture.whenStable();
      return fixture.nativeElement as HTMLElement;
    };

    it('renders one <p> per summary entry for a project that has them', async () => {
      // NexCoin (id 1) is the worked example carrying summary + highlights.
      const el = await render('1');

      const paragraphs = el.querySelectorAll('.project-summary p');
      expect(paragraphs.length).toBeGreaterThan(0);
      expect(paragraphs[0].textContent).toContain('NexCoin');
    });

    it('renders highlights as a list under a named region', async () => {
      const el = await render('1');

      const section = el.querySelector('.project-highlights')!;
      expect(section).toBeTruthy();
      // An unnamed <section> is exposed as no region at all.
      const labelledBy = section.getAttribute('aria-labelledby')!;
      expect(el.querySelector(`#${labelledBy}`)).toBeTruthy();
      expect(section.querySelectorAll('li').length).toBeGreaterThan(0);
    });

    it('omits the long-form blocks entirely for a project without them', async () => {
      // id 2 has no summary/highlights yet — it must render as it always did.
      const el = await render('2');

      expect(el.querySelector('.project-summary')).toBeNull();
      expect(el.querySelector('.project-highlights')).toBeNull();
      expect(el.querySelector('.project-meta')).toBeNull();
      // The short description is still there.
      expect(el.querySelector('.description')!.textContent).toContain('blog');
    });
  });

  describe('role / year metadata', () => {
    // No real project fills these yet, so drive the template with a stub rather
    // than inventing a role and a year for someone's actual work.
    const stub = (overrides: Partial<ProjectsTypes>): ProjectsTypes => ({
      id: 99,
      project_name: 'Stub',
      description: 'Stub description',
      img_path: '',
      technologies: [],
      github_link: '',
      demo_link: '',
      tech_stack: TechStack.frontend,
      ...overrides,
    });

    const renderWith = async (project: ProjectsTypes) => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [ProjectsComponent],
        providers: [
          provideRouter([]),
          { provide: ProjectService, useValue: { projects: signal([project]) } },
        ],
      }).compileComponents();

      const f = TestBed.createComponent(ProjectsComponent);
      f.componentRef.setInput('id', String(project.id));
      await f.whenStable();
      return f.nativeElement as HTMLElement;
    };

    it('shows both, separated', async () => {
      const el = await renderWith(stub({ role: 'Solo developer', year: 2025 }));

      const meta = el.querySelector('.project-meta')!;
      expect(meta.textContent).toContain('Solo developer');
      expect(meta.textContent).toContain('2025');
      expect(meta.textContent).toContain('·');
    });

    it('shows role alone without a dangling separator', async () => {
      const el = await renderWith(stub({ role: 'Solo developer' }));

      const meta = el.querySelector('.project-meta')!;
      expect(meta.textContent).toContain('Solo developer');
      expect(meta.textContent).not.toContain('·');
    });

    it('shows year alone without a dangling separator', async () => {
      const el = await renderWith(stub({ year: 2025 }));

      const meta = el.querySelector('.project-meta')!;
      expect(meta.textContent).toContain('2025');
      expect(meta.textContent).not.toContain('·');
    });
  });
});
