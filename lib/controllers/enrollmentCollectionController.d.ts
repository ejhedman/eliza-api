import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { EnrollmentQuery } from '../services/enrollmentQuery';
import { ControllerBase } from './controllerBase';
export declare class EnrollmentCollectionController extends ControllerBase {
    path: string;
    router: import("express-serve-static-core").Router;
    db: FirebaseFirestore.Firestore;
    enrollmentRepository: EnrollmentRepository;
    enrollmentQuery: EnrollmentQuery;
    constructor(path: string, db: FirebaseFirestore.Firestore);
    intializeRoutes(): void;
    getListAsync(req: any, res: any): Promise<void>;
    getDetailAsync(req: any, res: any): Promise<void>;
}
