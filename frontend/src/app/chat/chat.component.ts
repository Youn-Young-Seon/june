import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from './interface';
import { ChatSocketService } from './chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  isChatOpen = false;
  messages: ChatMessage[] = [];
  newMessage = '';
  isTyping = false;
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) 
    private platformId: Object,
    private chatSocket: ChatSocketService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    this.chatSocket.connect();
    this.chatSocket.onMessage().subscribe((msg: ChatMessage) => {
      this.messages.push(msg);
      this.scrollToBottom();
    });
  }

  ngOnDestroy() {
    this.chatSocket.disconnect();
  }

  toggleChat() {
    if (!this.isBrowser) return;
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 10);
    }
  }

  sendMessage() {
    if (!this.isBrowser) return;
    if (this.newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date(),
        isRead: true
      };
      this.chatSocket.sendMessage(message);
      this.messages.push(message);
      this.newMessage = '';
      this.scrollToBottom();
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (!this.isBrowser) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onTyping() {
    if (!this.isBrowser) return;
    this.isTyping = false;
  }

  private scrollToBottom() {
    if (!this.isBrowser) return;
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }

  getUnreadCount(): number {
    if (!this.isBrowser) return 0;
    return this.messages.filter(msg => !msg.isRead && msg.sender === 'admin').length;
  }

  formatTime(date: Date): string {
    if (!this.isBrowser) return '';
    return new Date(date).toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
