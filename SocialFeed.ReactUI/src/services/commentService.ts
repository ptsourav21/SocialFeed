import axiosClient from '../api/axiosClient';
import type { CommentResponseDto } from '../types/post';

export const commentService = {
    addComment: async (postId: string, content: string, parentCommentId: string | null = null): Promise<CommentResponseDto> => {
        const payload = {
            postId: postId,
            content: content,
            parentCommentId: parentCommentId 
        };
        const response = await axiosClient.post('/api/comments', payload);
        return response.data;
    },

    toggleCommentLike: async (commentId: string): Promise<void> => {
        await axiosClient.post(`/api/comments/${commentId}/like`);
    },

    getCommentLikes: async (commentId: string): Promise<{fullName: string}[]> => {
        const response = await axiosClient.get(`/api/comments/${commentId}/likes`);
        return response.data;
    },

    getCommentLikers: async (commentId: string): Promise<string[]> => {
    const response = await axiosClient.get(`/api/comments/${commentId}/likers`);
    return response.data;
    }
};