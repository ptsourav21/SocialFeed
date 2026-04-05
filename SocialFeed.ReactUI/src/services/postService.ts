import axiosClient from '../api/axiosClient';
import type { CreatePostDto, PostResponseDto, CommentResponseDto, UserDto } from '../types/post';

export const postService = {
    getFeedPosts: async (): Promise<PostResponseDto[]> => {
        const response = await axiosClient.get('/api/posts');
        return response.data;
    },

    createPost: async (postData: CreatePostDto): Promise<PostResponseDto> => {
        const response = await axiosClient.post('/api/posts', postData);
        return response.data;
    },

    togglePostLike: async (postId: string): Promise<void> => {
        await axiosClient.post(`/api/posts/${postId}/like`);
    },

    getPostLikes: async (postId: string): Promise<UserDto[]> => {
        const response = await axiosClient.get(`/api/posts/${postId}/likes`);
        return response.data;
    },
    
    getPostLikers: async (postId: string): Promise<string[]> => {
    const response = await axiosClient.get(`/api/posts/${postId}/likers`);
    return response.data; 
    }
};