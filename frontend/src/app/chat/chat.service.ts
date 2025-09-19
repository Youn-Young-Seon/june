import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ChatMessage } from './interface';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private socket: Socket | null = null;
  private idx: string | null = null;

  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    this.idx = this.authService.getToken();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(this.configService.wsUrl, {
        withCredentials: true
      });
      this.socket.emit('joinRoom', this.idx);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(msg: ChatMessage) {
    this.socket?.emit('sendMessage', {roomId: this.idx, message: msg.text, userId: this.idx});
  }

  onMessage(): Observable<ChatMessage> {
    return new Observable(observer => {
      this.socket?.on('receiveMessage', (data: ChatMessage) => {
        observer.next(data);        
      });
    });
  }
}