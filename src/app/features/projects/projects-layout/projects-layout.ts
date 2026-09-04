import { Component } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon';
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
export class ProjectsLayout {}