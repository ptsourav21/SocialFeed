import axiosClient from '../api/axiosClient';
import type { CreatePostDto, PostResponseDto, CommentResponseDto, UserDto } from '../types/post';

export const postService = {
    // 1. Get all posts (Backend should return newest first & filter private posts)
    getFeedPosts: async (): Promise<PostResponseDto[]> => {
        const response = await axiosClient.get('/api/posts');
        return response.data;
    },

    // 2. Create a Post (Supports Text, Image URL from ImgBB, and Public/Private state)
    createPost: async (postData: CreatePostDto): Promise<PostResponseDto> => {
        const response = await axiosClient.post('/api/posts', postData);
        return response.data;
    },

    // 3. Toggle Like on a Post
    togglePostLike: async (postId: string): Promise<void> => {
        await axiosClient.post(`/api/posts/${postId}/like`);
    },

    // 6. Get Users who liked a post (To show who liked it)
    getPostLikes: async (postId: string): Promise<UserDto[]> => {
        const response = await axiosClient.get(`/api/posts/${postId}/likes`);
        return response.data;
    }
};