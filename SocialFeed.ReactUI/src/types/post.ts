export interface UserDto {
    id: string;
    fullName: string;
    profileImageUrl?: string;
}

export interface CommentResponseDto {
    id: string;
    content: string;
    createdAt: string;
    authorName: string;
    authorId: string;
    likesCount: number;
    hasLiked: boolean;
    replies?: CommentResponseDto[];
}

export interface PostResponseDto {
    id: string;
    userId: string;
    authorName: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    isPublic: boolean;
    hasLiked: boolean; 
    comments?: CommentResponseDto[];
}

export interface CreatePostDto {
    content: string;
    imageUrl?: string;
    isPublic: boolean;
}