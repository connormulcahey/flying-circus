import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="main-header">
      <h1>Hudson Valley Flying Circus</h1>
      <nav class="main-nav">
        @if (showBackButton) {
          <a href="#" (click)="onBackClick($event)" class="nav-tab back-link">← Back to Posts</a>
        } @else {
          <a href="#" 
             (click)="onNavigate('posts', $event)" 
             [class]="'nav-tab ' + (currentView === 'posts' ? 'active' : '')">Posts</a>
          <a href="#" 
             (click)="onNavigate('facilities', $event)" 
             [class]="'nav-tab ' + (currentView === 'facilities' ? 'active' : '')">Facilities</a>
          <a href="#" 
             (click)="onNavigate('staff', $event)" 
             [class]="'nav-tab ' + (currentView === 'staff' ? 'active' : '')">Staff</a>
        }
      </nav>
    </header>
    <div class="pole-vault-bar">
      <div class="rubber-end"></div>
      <div class="bar"></div>
      <div class="rubber-end"></div>
    </div>
  `,
  styles: [`
    .main-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 20;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    h1 {
      text-align: center;
      margin: 0;
      padding: 0.5rem 0 0.25rem 0;
      color: #6203a3;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 1.5rem;
    }

    .main-nav {
      display: flex;
      justify-content: center;
      gap: 1rem;
      padding: 0.25rem 0 0.5rem 0;
      border-bottom: 1px solid rgba(238, 238, 238, 0.5);
    }

    .nav-tab {
      color: #666;
      text-decoration: none;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      transition: all 0.2s;
      font-weight: 500;
      font-size: 0.8rem;
    }

    .nav-tab:hover {
      color: #6203a3;
      background: rgba(98, 3, 163, 0.1);
    }

    .nav-tab.active {
      color: #6203a3;
      background: rgba(98, 3, 163, 0.15);
      font-weight: 600;
    }

    .back-link {
      color: #6203a3 !important;
      font-weight: 600;
    }

    .back-link:hover {
      color: #6203a3 !important;
      background: rgba(98, 3, 163, 0.15) !important;
    }

    .pole-vault-bar {
      position: fixed;
      top: 4rem;
      left: 0;
      right: 0;
      z-index: 25;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      width: calc(100% - 25px);
      height: 30px;
      padding: 0 0 5px 0;
    }

    .bar {
      width: 100%;
      height: 12px;
      z-index: 2;
      box-shadow: 0 1px 2px #999;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#e9f15e), to(#a5ae11));
      background: -webkit-linear-gradient(top, #e9f15e, #a5ae11);
    }

    .rubber-end {
      width: 100px;
      height: 16px;
      margin: 0;
      border-radius: 2px;
      border-right: 2px solid #3375B5;
      border-bottom: 3px solid #003972;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#1963ac), to(#004a93));
      background: -webkit-linear-gradient(top, #1963ac, #004a93);
      background: -moz-linear-gradient(top, #1963ac, #004a93);
      background: -ms-linear-gradient(top, #1963ac, #004a93);
      background: -o-linear-gradient(top, #e9f15e, #b2bc14);
      box-shadow: 0 1px 3px #444;
    }
  `]
})
export class NavigationComponent {
  @Input() currentView: string = 'posts';
  @Input() showBackButton: boolean = false;
  @Output() navigate = new EventEmitter<string>();
  @Output() backClick = new EventEmitter<void>();

  onNavigate(view: string, event: Event) {
    event.preventDefault();
    this.navigate.emit(view);
  }

  onBackClick(event: Event) {
    event.preventDefault();
    this.backClick.emit();
  }
}