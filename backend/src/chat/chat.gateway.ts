import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    return { message: 'joined room' };
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    return { message: 'left room' };
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: { roomId: string; message: string; userId: string }) {
    const { roomId, message, userId } = payload;
    
    // 메시지를 채팅방의 모든 클라이언트에게 브로드캐스트
    this.server.to(roomId).emit('newMessage', {
      message,
      userId,
      timestamp: new Date().toISOString(),
      roomId
    });

    // 메시지를 데이터베이스에 저장 (선택사항)
    await this.chatService.saveMessage({
      roomId,
      message,
      userId,
      timestamp: new Date()
    });

    return { message: 'Message sent successfully' };
  }

  @SubscribeMessage('getRoomMessages')
  async getRoomMessages(client: Socket, roomId: string) {
    const messages = await this.chatService.getRoomMessages(parseInt(roomId));
    return { messages };
  }

  @SubscribeMessage('getRooms')
  async getRooms(client: Socket) {
    const rooms = await this.chatService.getRooms();
    return { rooms };
  }

  @SubscribeMessage('createRoom')
  async createRoom(client: Socket, payload: { name: string; description?: string; createdBy: number }) {
    const room = await this.chatService.createRoom(payload);
    return { room };
  }
}
