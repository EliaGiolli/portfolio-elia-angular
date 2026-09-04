import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <app-navbar />
    
    <main class="content-wrapper">
      <router-outlet /> </main>

    <app-footer />
  `,
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {}