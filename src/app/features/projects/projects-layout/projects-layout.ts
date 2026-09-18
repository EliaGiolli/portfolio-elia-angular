import { Component, inject } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon';
import { SeoService } from '../../../core/services/seo.service';
import { Card } from '../../../shared/components/card/card';
import { RouterLink } from "@angular/router";
import { Button } from '../../../shared/components/button/button';

@Component({
  selector: 'app-projects-layout',
  imports: [
    Card,
    Button,
    IconComponent, 
    RouterLink,
  ],
  templateUrl: './projects-layout.html',
  styleUrl: './projects-layout.css',
})
export class ProjectsLayout {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'Projects | Elia Giolli',
      description:
        'Browse Elia Giolli\'s projects by stack — front-end work in Angular, React, Next.js and Astro, back-end work in Node.js, Express and NestJS.',
      path: '/projects'
    });
  }
}