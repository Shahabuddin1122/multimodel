import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [
    NgOptimizedImage,
    ButtonComponent
  ],
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target?.files[0];
      console.log('File uploaded:', file.name);
    }
  }
}
