import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ChatRoom, Message } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoomMessages(roomId: number): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getRooms(): Promise<ChatRoom[]> {
    return this.prisma.chatRoom.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRoom(payload: { name: string; description?: string; createdBy: number }): Promise<ChatRoom> {
    // createdBy는 User idx로 받음
    return this.prisma.chatRoom.create({
      data: {
        name: payload.name,
        description: payload.description,
        // createdBy 필드는 ChatRoom에 없으므로, 필요시 Message로 첫 system 메시지 생성 등 추가 구현 가능
      },
    });
  }

  async saveMessage({ roomId, message, userId, timestamp }: { roomId: string; message: string; userId: string; timestamp: Date }): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content: message,
        messageType: 'TEXT',
        userId: parseInt(userId, 10),
        chatRoomId: parseInt(roomId, 10),
        createdAt: timestamp,
      },
    });
  }
}
