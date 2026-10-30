declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                firstName: string;
            };
        }
    }
}
export {};