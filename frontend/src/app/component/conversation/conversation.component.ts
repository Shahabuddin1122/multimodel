import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
export class ConversationComponent {
  @Input() selectedModel: string = 'deepseek-r1:1.5b';
  @Input() selectedMode: string = 'general';
  @Input() uploadedFile?: File = undefined;
  @Input() showNextComponent = false;
  @Input() collection_id = '';
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  userId = uuidv4();

  // Remove initial dummy message
  messages: { sender: string, text: string }[] = [];

  userInput = '';

  constructor(private chatService: ChatService) {}

  onGetStarted() {
    this.showNextComponent = true;
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
          this.messages.push({ sender: 'llm', text: 'To ensure that no HTML tags appear in the LLM-generated text, you can sanitize the response by stripping out any HTML tags using a regular expression or a DOM parser.' });
          this.scrollToBottom();
        }, 500);
        // General mode: Call OllamaService
        // this.chatService.generateResponse(this.userInput, this.selectedModel, this.userId)
        //   .subscribe(response => {
        //     let rawText = response.choices[0]?.message?.content || 'No response';
        //     let sanitizedText = rawText.replace(/<\/?[^>]+(>|$)/g, "");
        //     this.messages.push({ sender: 'llm', text: sanitizedText });
        //     this.scrollToBottom();
        //   });

      } else if (this.selectedMode === 'document' && this.uploadedFile) {
        // Document mode: Call LlamaService
        this.chatService.queryLlama(
          'llama3-8b-8192',
          this.userInput,
          this.collection_id,
          5,
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
