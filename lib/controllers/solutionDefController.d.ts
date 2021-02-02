import { SolutionDefRepository } from '../repositories/solutionDefRepository';
import { SolutionDefQuery } from '../services/solutionDefQuery';
import { ControllerBase } from './controllerBase';
export declare class SolutionDefController extends ControllerBase {
    path: string;
    router: import("express-serve-static-core").Router;
    db: FirebaseFirestore.Firestore;
    solutionRepository: SolutionDefRepository;
    solutionQuery: SolutionDefQuery;
    constructor(path: string, db: FirebaseFirestore.Firestore);
    intializeRoutes(): void;
    getListAsync(req: any, res: any): Promise<void>;
    getDetailAsync(req: any, res: any): Promise<void>;
}
