import { Component, OnInit, inject } from '@angular/core';
import { Card } from '../../../shared/components/card/card';
import { IconComponent } from '../../../shared/components/icon/icon';
import { Button } from '../../../shared/components/button/button';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-about',
  imports: [Card, IconComponent, Button],
  standalone: true,
  templateUrl: './about-me.html',
  styleUrl: './about-me.css'
})
export class AboutComponent {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'About | Elia Giolli — Angular Front-End Developer',
      description: 'Angular developer with an IT support background, building accessible, component-driven web apps with TypeScript, Node.js, and NestJS.'
    });
  }
}