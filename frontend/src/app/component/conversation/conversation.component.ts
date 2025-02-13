import { Component } from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {MessageComponent} from '../message/message.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-conversation',
  standalone: true,
  templateUrl: './conversation.component.html',
  imports: [
    ButtonComponent,
    MessageComponent,
    NgIf
  ],
  styleUrl: './conversation.component.css'
})
export class ConversationComponent {
  showNextComponent = false;

  onGetStarted() {
    this.showNextComponent = true;
  }
}
