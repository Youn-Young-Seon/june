export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: Date;
    isRead: boolean;
}