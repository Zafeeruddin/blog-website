
export type blog={
    authorId:string,
    title:string,
    published:boolean,
    content:string,
    id:string,
    likes:number,
    date:Date,
    author:{
        name:string,
        id:string
    }
}

export interface Notification{
    "comments":comment[],
    "replies":Reply[]
}

export interface comment{
    id:string,
    comment:string,
    user:string,
    flagNotified: boolean,
    date:Date,
    claps:number,
    postId:string,  
    replyCount:number
}


export interface Reply{
    "id": string,
    "reply": string,
    "user": string,
    "postId":string
    "flagNotified": boolean,
    "claps": number,
    "commentId": string,
    "date": Date,
    "notificationId": string,
}


export interface UnifiedNotification {
    content: string; // Either comment or reply
    user: string;
    postId: string;
    isComment: boolean;
    date: Date;
    flagNotified:boolean
}
