import {Component, Input} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  templateUrl: './message.component.html',
  imports: [
    NgIf,
    NgOptimizedImage
  ],
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message: { sender: string; text: string, name?: string } = { sender: '', text: '', name: '' };
}
