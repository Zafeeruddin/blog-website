export type comment={
        id: string;
        user: string | null;
        date: Date;
        claps: number;
        comment: string;
        userId: string;
        postId: string;
        notificationId: string;
        flagNotified: boolean;
        replyCount: number;
    
}

export type reply={
        id: string;
        user: string;
        date: Date;
        claps: number;
        postId: string | null;
        notificationId: string;
        flagNotified: boolean;
        commentId: string;
        reply: string;
    
}