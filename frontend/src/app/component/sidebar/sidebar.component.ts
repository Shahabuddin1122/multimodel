import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [NgOptimizedImage, ButtonComponent, NgIf],
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() selectModeChanged = new EventEmitter<{ mode: string; file?: File }>();

  showModal = false;

  openModeSelection() {
    this.showModal = true;
  }

  selectMode(mode: string) {
    this.showModal = false;
    if (mode === 'document') {
      this.triggerFileUpload();
    } else {
      this.selectModeChanged.emit({ mode: 'general' });
    }
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target?.files[0];
      this.selectModeChanged.emit({ mode: 'document', file });
    }
  }
}
