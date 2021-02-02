import { SolutionDefRepository } from '../repositories/solutionDefRepository';
import { ProgramDefRepository } from '../repositories/programDefRepository';
export declare class SolutionDefQuery {
    db: FirebaseFirestore.Firestore;
    solutionRepository: SolutionDefRepository;
    programRepository: ProgramDefRepository;
    constructor(db: FirebaseFirestore.Firestore);
    getDetailAsync(clientId: string, solutionId: string, req: any): Promise<FirebaseFirestore.DocumentData | null | undefined>;
}
