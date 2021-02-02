import { OutreachResultRepository } from '../repositories/outreachResultRepository';
import { OutreachResultQuery } from '../services/outreachResultQuery';
import { ControllerBase } from './controllerBase';
export declare class OutreachResultCollectionController extends ControllerBase {
    path: string;
    router: import("express-serve-static-core").Router;
    db: FirebaseFirestore.Firestore;
    outreachResultRepository: OutreachResultRepository;
    outreachResultQuery: OutreachResultQuery;
    constructor(path: string, db: FirebaseFirestore.Firestore);
    intializeRoutes(): void;
    getListAsync(req: any, res: any): Promise<void>;
    getDetailAsync(req: any, res: any): Promise<void>;
}
