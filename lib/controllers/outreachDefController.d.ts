import { OutreachDefRepository } from '../repositories/outreachDefRepository';
import { OutreachDefQuery } from '../services/outreachDefQuery';
import { ControllerBase } from './controllerBase';
export declare class OutreachDefController extends ControllerBase {
    path: string;
    router: import("express-serve-static-core").Router;
    db: FirebaseFirestore.Firestore;
    outreachRepository: OutreachDefRepository;
    outreachQuery: OutreachDefQuery;
    constructor(path: string, db: FirebaseFirestore.Firestore);
    intializeRoutes(): void;
    getListAsync(req: any, res: any): Promise<void>;
    getDetailAsync(req: any, res: any): Promise<void>;
}
