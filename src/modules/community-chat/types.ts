export interface ChatPost {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar?: string; // Seed for DiceBear or URL
    text: string;
    createdAt: string; // ISO String
    expiresAt: string; // ISO String
    replyCount: number;
}

export interface ChatReply {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    text: string;
    createdAt: string;
    expiresAt: string;
}
