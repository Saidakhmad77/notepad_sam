
const ACCESS_KEY = 'np_access_token';
const REFRESH_KEY = 'np_access_token';

export const token = {
    // Access token
    get access() {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(ACCESS_KEY);
    },

    // Refresh token
    get refresh() {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(REFRESH_KEY);
    },

    // Save token
    set(accessToken: string, refreshToken?: string) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(ACCESS_KEY, accessToken);
        if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    },

    // Clear token
    clear() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },
};