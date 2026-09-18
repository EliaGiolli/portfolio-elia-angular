import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <a class="skip-link" href="#content">Skip to main content</a>

    <app-navbar />

    <!-- The one <main> for the whole app: routed pages render inside it and must not
         declare their own, or the page ends up with nested 'main' landmarks. -->
    <main id="content" class="content-wrapper" tabindex="-1">
      <router-outlet />
    </main>

    <app-footer />
  `,
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {}