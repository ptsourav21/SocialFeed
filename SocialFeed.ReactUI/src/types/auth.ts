export interface LoginRequestDto {
    email: string;
    password: string;
}

export interface RegisterRequestDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponseDto {
    token: string;
    userId: string;
    firstName: string;
}