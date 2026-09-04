import { Component } from '@angular/core';
import { Button } from "../../shared/components/button/button";
import { IconComponent } from "../../shared/components/icon/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-not-found',
  imports: [Button, IconComponent, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {}
