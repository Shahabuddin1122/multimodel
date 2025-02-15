import {Component, Input} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  templateUrl: './message.component.html',
  imports: [
    ButtonComponent,
    NgIf,
    NgOptimizedImage
  ],
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message: { sender: string; text: string } = { sender: '', text: '' };
}
