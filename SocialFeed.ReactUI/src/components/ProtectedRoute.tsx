import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
}