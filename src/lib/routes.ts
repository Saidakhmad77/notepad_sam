export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const routes = {
    signup: () => `/auth/signup`,
    signin: () => `/auth/signin`,
    refresh: () => `/auth/refresh`,

    boards: (page?: number, size?: number) => {
        const qp = new URLSearchParams();
        if (page !== undefined) qp.set('page', String(page));
        if (size !== undefined) qp.set('size', String(size));
        const qs = qp.toString();
        return `/boards${qs ? `?${qs}` : ''}`;
    },
    boardById: (id: string | number) => `/boards/${id}`,
    categories: () => `/boards/categories`,
} as const;