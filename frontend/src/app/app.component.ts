import { Component } from '@angular/core';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { TopbarComponent } from './component/topbar/topbar.component';
import { ConversationComponent } from './component/conversation/conversation.component';
import { DocumentUploadService } from './services/document-upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.css',
  imports: [SidebarComponent, TopbarComponent, ConversationComponent]
})
export class AppComponent {
  selectedModel = 'deepseek-r1:1.5b';
  selectMode: string = 'general';
  uploadedFile?: File;
  showNextComponent = false;
  collectionId = '';
  documentContent = '';
  messages: { sender: string, name?: string, text: string }[] = []

  constructor(private documentUploadService: DocumentUploadService) {}

  handleModeSelection(event: { mode: string; file?: File }) {
    this.selectMode = event.mode;
    this.messages = [];

    if (event.mode === 'document' && event.file) {
      this.uploadedFile = event.file;
      this.uploadDocument(event.file);
    } else {
      this.uploadedFile = undefined;
      this.showNextComponent = true;
    }
  }

  handleSelectionChange(value: string) {
    this.selectedModel = value;
  }

  uploadDocument(file: File) {
    this.messages = [];
    this.documentUploadService.uploadFile(file).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        this.collectionId = event.body.files[0]['collection_id'];
        this.documentContent = event.body.files[0]['extracted_texts'][0]
        this.showNextComponent = true;
      }
    }, error => {
      console.error('Upload failed:', error);
    });
  }
}
