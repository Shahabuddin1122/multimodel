import { Component,Input } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrl: './button.component.css'
})
export class ButtonComponent {
    @Input() text: string = '';
    @Input() icon: string = '';
}
