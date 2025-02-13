import { Component } from '@angular/core';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-message',
  standalone: true,
  templateUrl: './message.component.html',
  imports: [
    ButtonComponent
  ],
  styleUrl: './message.component.css'
})
export class MessageComponent {

}
