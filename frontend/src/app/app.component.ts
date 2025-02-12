import { Component } from '@angular/core';
import {SidebarComponent} from './component/sidebar/sidebar.component';
import {TopbarComponent} from './component/topbar/topbar.component';
import {ConversationComponent} from './component/conversation/conversation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.css',
  imports: [SidebarComponent, TopbarComponent, ConversationComponent]
})
export class AppComponent{}
