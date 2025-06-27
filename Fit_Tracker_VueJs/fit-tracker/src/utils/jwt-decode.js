export function decodeJwt(token) {
    try {
        if (!token) {
            throw new Error('No token provided');
        }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        if (!decoded.userId || !decoded.sub || !decoded.role) {
            throw new Error('Invalid JWT payload');
        }
        return {
            id: decoded.userId,
            username: decoded.sub,
            role: decoded.role,
        };
    } catch (error) {
        console.error('Failed to decode JWT:', error.message);
        return null;
    }
}