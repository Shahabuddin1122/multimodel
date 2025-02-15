import { Component } from '@angular/core';
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

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ sender: 'user', text: this.userInput });

      // Simulate an LLM response (Replace with real API call)
      // setTimeout(() => {
      //   this.messages.push({ sender: 'llm', text: 'Processing your request...' });
      // }, 500);
      this.ollamaService.generateResponse(this.userInput, "deepseek-r1:1.5b").subscribe(response => {
        this.messages.push({ sender: 'llm', text: response.response });
      });

      this.userInput = '';
    }
  }
}
