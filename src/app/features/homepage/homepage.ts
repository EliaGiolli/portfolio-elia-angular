import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-homepage',
  imports: [
    IconComponent, 
    Button, 
    RouterLink
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {}
