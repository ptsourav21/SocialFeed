import axiosClient from '../api/axiosClient';
import type { LoginRequestDto, RegisterRequestDto, AuthResponseDto } from '../types/auth';

export const authService = {
    login: async (data: LoginRequestDto): Promise<AuthResponseDto> => {
        const response = await axiosClient.post<AuthResponseDto>('/api/auth/login', data);
        return response.data;
    },
    
    register: async (data: RegisterRequestDto): Promise<AuthResponseDto> => {
        const response = await axiosClient.post<AuthResponseDto>('/api/auth/register', data);
        return response.data;
    }
};