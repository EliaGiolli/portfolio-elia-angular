import { Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon';
import { RouterLink } from "@angular/router";
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-cv',
  imports: [IconComponent, RouterLink],
  templateUrl: './cv.html',
  styleUrl: './cv.css',
})
export class Cv {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'CV | Elia Giolli — Full-Stack Developer',
      description:
        'Curriculum of Elia Giolli: experience, technical skills and education behind a front-end career built on Angular, TypeScript and Node.js.',
      path: '/cv'
    });
  }
}
