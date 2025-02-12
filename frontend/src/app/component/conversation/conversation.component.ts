import { Component } from '@angular/core';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-conversation',
  standalone: true,
  templateUrl: './conversation.component.html',
  imports: [
    ButtonComponent
  ],
  styleUrl: './conversation.component.css'
})
export class ConversationComponent {

}
