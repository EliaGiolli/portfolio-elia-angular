import { Component } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cv',
  imports: [IconComponent, RouterLink],
  templateUrl: './cv.html',
  styleUrl: './cv.css',
})
export class Cv {}
