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

    it('shows the full detailed stack, not the headline set', async () => {
      // NexCoin's grid card shows 3 icons; its detail page shows the full 11.
      const el = await render('1');

      const items = el.querySelectorAll('.tech-list .tech-item');
      expect(items.length).toBeGreaterThan(3);
      // Rendered through techLabel, so slugs are not shown raw.
      expect(el.querySelector('.tech-list')!.textContent).toContain('Next.js');
      expect(el.querySelector('.tech-list')!.textContent).not.toContain('nextdotjs');
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

    // Every real project now has the long-form fields, so absence is only
    // reachable through a stub — but the template must still tolerate it.
    it('omits every optional block when a project has none of them', async () => {
      const el = await renderWith(stub({}));

      expect(el.querySelector('.project-meta')).toBeNull();
      expect(el.querySelector('.project-summary')).toBeNull();
      expect(el.querySelector('.project-highlights')).toBeNull();
      expect(el.querySelector('.description')!.textContent).toContain('Stub description');
    });

    it('falls back to technologies when there is no detailed list', async () => {
      const el = await renderWith(stub({ technologies: ['angular', 'typescript'] }));

      const items = el.querySelectorAll('.tech-list .tech-item');
      expect(items.length).toBe(2);
      expect(el.querySelector('.tech-list')!.textContent).toContain('TypeScript');
    });
  });
});
