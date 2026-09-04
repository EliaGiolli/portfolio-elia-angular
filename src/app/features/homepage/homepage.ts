import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon';
import { Button } from '../../shared/components/button/button';
import { TooltipDirective } from '../../core/directives/tooltip.directive';

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
export class Homepage {}
