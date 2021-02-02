import { ClientDefRepository } from '../repositories/clientDefRepository';
import { ClientDefQuery } from '../services/clientDefQuery';
import { ControllerBase } from './controllerBase';
export declare class ClientDefController extends ControllerBase {
    path: string;
    router: import("express-serve-static-core").Router;
    db: FirebaseFirestore.Firestore;
    clientDefRepository: ClientDefRepository;
    clientQuery: ClientDefQuery;
    constructor(path: string, db: FirebaseFirestore.Firestore);
    intializeRoutes(): void;
    getListAsync(req: any, res: any): Promise<void>;
    getDetailAsync(req: any, res: any): Promise<void>;
}
