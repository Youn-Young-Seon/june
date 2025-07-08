import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class ChatGateway {
  private logger = new Logger('ChatGateway');

  constructor(
    private readonly chatService: ChatService
  ) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, roomId: string) {
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
    client.join(roomId);
    return { message: `joined room ${roomId}` };
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    return { message: 'left room' };
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: { roomId: string; message: string; userId: string }) {
    const { roomId, message, userId } = payload;
    
    this.logger.error(`roomId ${roomId} message ${message} userId ${userId}`);

    // 메시지를 채팅방의 모든 클라이언트에게 브로드캐스트
    this.server.to(roomId).emit('receiveMessage', {
      message,
      userId,
      timestamp: new Date().toISOString(),
      roomId
    });

    // // 메시지를 데이터베이스에 저장 (선택사항)
    // await this.chatService.saveMessage({
    //   roomId,
    //   message,
    //   userId,
    //   timestamp: new Date()
    // });

    return { message: 'Message sent successfully' };
  }
}
