import { ProgramDefRepository } from '../repositories/programDefRepository';
import { ProgramDefQuery } from '../services/programDefQuery';
import { ControllerBase } from './controllerBase';
export declare class ProgramDefController extends ControllerBase {
    path: string;
    router: import("express-serve-static-core").Router;
    db: FirebaseFirestore.Firestore;
    programRepository: ProgramDefRepository;
    programQuery: ProgramDefQuery;
    constructor(path: string, db: FirebaseFirestore.Firestore);
    intializeRoutes(): void;
    getListAsync(req: any, res: any): Promise<void>;
    getDetailAsync(req: any, res: any): Promise<void>;
}
