import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive,IconComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  // Stato del menu mobile
  isMenuOpen = signal(false);

  readonly MENU_ICON = 'menu';
  readonly CLOSE_ICON = 'x';

  toggleMenu() {
    this.isMenuOpen.update(val => !val);
  }
}
