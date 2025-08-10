import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
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