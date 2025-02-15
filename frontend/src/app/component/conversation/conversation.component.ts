import {Component, ElementRef, ViewChild} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {MessageComponent} from '../message/message.component';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { OllamaService } from '../../services/ollama.service';

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
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  showNextComponent = false;
  messages = [
    { sender: 'user', text: 'Hello, LLM!' },
    { sender: 'llm', text: 'Hello! How can I assist you today?' }
  ];
  userInput = '';
  constructor(private ollamaService: OllamaService) {}


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

      // Simulate an LLM response (Replace with real API call)
      setTimeout(() => {
        this.messages.push({ sender: 'llm', text: 'To ensure that no HTML tags appear in the LLM-generated text, you can sanitize the response by stripping out any HTML tags using a regular expression or a DOM parser.' });
        this.scrollToBottom();
      }, 500);
      // this.ollamaService.generateResponse(this.userInput, "deepseek-r1:1.5b").subscribe(response => {
      //   let rawText = response.choices[0].message['content'];
      //   let sanitizedText = rawText.replace(/<\/?[^>]+(>|$)/g, "");
      //   console.log(sanitizedText);
      //   this.messages.push({ sender: 'llm', text: sanitizedText });
      //   this.scrollToBottom();
      // });

      this.userInput = '';
    }
  }
}
