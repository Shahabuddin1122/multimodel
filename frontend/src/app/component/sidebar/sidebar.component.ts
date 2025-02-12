import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
