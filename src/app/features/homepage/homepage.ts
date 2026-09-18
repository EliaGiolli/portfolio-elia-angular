import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon';
import { Button } from '../../shared/components/button/button';
import { TooltipDirective } from '../../core/directives/tooltip.directive';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-homepage',
  imports: [
    IconComponent, 
    Button, 
    RouterLink, 
    TooltipDirective
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'Elia Giolli — Full-Stack Developer',
      description:
        'Portfolio of Elia Giolli: full-stack projects built with Angular, React, Next.js, Node.js and NestJS, focused on accessibility and performance.',
      path: '/'
    });
  }
}
