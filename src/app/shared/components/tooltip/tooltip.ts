import { Component, input } from "@angular/core";

@Component({
  selector: 'app-tech-tooltip',
  standalone: true,
  template: `
    <div class="tooltip-box">
      {{ techName() }}
    </div>
  `,
  styles: [`
    .tooltip-box {
      background: var(--text-primary);
      color: white;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      position: absolute;
      z-index: 1000;
      white-space: nowrap;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
  `]
})
export class TechTooltip {
  techName = input.required<string>(); 
}