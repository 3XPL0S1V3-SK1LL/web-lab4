import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Импортируем CommonModule
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router'; 
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';  // Импортируем BreakpointObserver

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],  
  template: `
    <div [ngClass]="currentMode">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lab4-front';
  currentMode: string = 'desktop';  // Изначально ставим десктопный режим

  constructor(private breakpointObserver: BreakpointObserver) {
    // Наблюдаем за изменением размера экрана
    this.breakpointObserver.observe([
      '(max-width: 669px)',                     // Мобильный
      '(min-width: 670px) and (max-width: 1232px)', // Планшетный
      '(min-width: 1232px)'                     // Десктопный
    ]).subscribe(result => {
      if (result.breakpoints['(max-width: 669px)']) {
        this.currentMode = 'mobile';
      } else if (result.breakpoints['(min-width: 670px) and (max-width: 1232px)']) {
        this.currentMode = 'tablet';
      } else if (result.breakpoints['(min-width: 1232px)']) {
        this.currentMode = 'desktop';
      }
      console.log("Current mode:", this.currentMode);
    });
  }
}
