import * as express from 'express';
declare global {
    namespace Express {
        interface Request {
            apiUrls?: any;
        }
    }
}
export declare class App {
    app: express.Application;
    db: FirebaseFirestore.Firestore;
    baseUrl: string;
    constructor(baseUrl: string);
    private setupMiddleware;
    private setupControllers;
    private setupStatic;
}
