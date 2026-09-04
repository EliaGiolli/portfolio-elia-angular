import { Component, OnInit, inject } from '@angular/core';
import { Card } from '../../../shared/components/card/card';
import { IconComponent } from '../../../shared/components/icon/icon';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  imports: [Card, IconComponent],
  standalone: true,
  templateUrl: './about-me.html',
  styleUrl: './about-me.css'
})
export class AboutComponent implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  ngOnInit(): void {
    this.titleService.setTitle('Chi Sono | Elia Giolli - IT Specialist & Technical Support');
    
    this.metaService.addTags([
      { name: 'description', content: 'Profilo professionale di Elia Giolli, IT Specialist ed Help Desk Technician. Competenze in supporto tecnico, gestione sistemi, troubleshooting e sviluppo web.' },
      { name: 'keywords', content: 'Elia Giolli, IT Specialist, Help Desk, Technical Support, Supporto Tecnico IT, Troubleshooting, Sistemista Junior, Angular' },
      { property: 'og:title', content: 'Elia Giolli | IT Specialist & Support Technician' },
      { property: 'og:description', content: 'Specialista IT esperto in supporto tecnico, troubleshooting hardware/software e gestione sistemi.' }
    ]);
  }
}