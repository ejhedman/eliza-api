import { OutreachRepository } from '../repositories/outreachRepository';
import { OutreachQuery } from '../services/outreachQuery';
import { ControllerBase } from './controllerBase';
export declare class OutreachCollectionController extends ControllerBase {
    path: string;
    router: import("express-serve-static-core").Router;
    db: FirebaseFirestore.Firestore;
    outreachRepository: OutreachRepository;
    outreachQuery: OutreachQuery;
    constructor(path: string, db: FirebaseFirestore.Firestore);
    intializeRoutes(): void;
    getListAsync(req: any, res: any): Promise<void>;
    getDetailAsync(req: any, res: any): Promise<void>;
}
