import { Component, ElementRef, Input, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MessageComponent } from '../message/message.component';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/ollama.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-conversation',
  standalone: true,
  templateUrl: './conversation.component.html',
  imports: [
    ButtonComponent,
    MessageComponent,
    NgIf,
    NgForOf,
    FormsModule
  ],
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit, OnChanges {
  @Input() selectedModel: string = 'deepseek-r1:1.5b'; // selected model
  @Input() selectedMode: string = 'general';  // general or document
  @Input() uploadedFile?: File = undefined;  // file name
  @Input() showNextComponent = false; // initial page and conversation page
  @Input() collection_id = '';  // unique id for each document
  @Input() documentContent: string = ''; // document content
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  userId = uuidv4();
  messages: { sender: string, name?: string, text: string }[] = [];
  userInput = '';
  documentInitialized = false; // Flag to check if document content is added

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.initializeDocumentContent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showNextComponent'] || changes['documentContent']) {
      this.initializeDocumentContent();
    }
  }

  initializeDocumentContent() {
    if (
      this.selectedMode === 'document' &&
      this.documentContent &&
      this.showNextComponent &&
      !this.documentInitialized
    ) {
      this.messages.push({ sender: 'document', text: this.documentContent, name: this.uploadedFile?.name });
      this.documentInitialized = true;
    }
  }

  onGetStarted() {
    this.showNextComponent = true;
    this.initializeDocumentContent();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ sender: 'user', text: this.userInput });

      if (this.selectedMode === 'general') {
        setTimeout(() => {
          this.messages.push({
            sender: 'llm',
            text: 'To ensure that no HTML tags appear in the LLM-generated text, you can sanitize the response by stripping out any HTML tags using a regular expression or a DOM parser.'
          });
          this.scrollToBottom();
        }, 500);
      } else if (this.selectedMode === 'document' && this.uploadedFile) {
        // Ensure document content is initialized
        this.initializeDocumentContent();

        // Query the document-based LLM
        this.chatService.queryLlama(
          'llama3-8b-8192',
          this.userInput,
          this.collection_id,
          3,
          this.userId
        ).subscribe(response => {
          let rawText = response?.llm_response || 'No response';
          let sanitizedText = rawText.replace(/<\/?[^>]+(>|$)/g, "");
          this.messages.push({ sender: 'llm', text: sanitizedText });
          this.scrollToBottom();
        });
      }
      this.userInput = '';
    }
  }
}
