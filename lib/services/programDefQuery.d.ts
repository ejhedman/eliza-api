import { ProgramDefRepository } from '../repositories/programDefRepository';
import { OutreachRepository } from '../repositories/outreachRepository';
export declare class ProgramDefQuery {
    db: FirebaseFirestore.Firestore;
    programRepository: ProgramDefRepository;
    outreachRepository: OutreachRepository;
    constructor(db: FirebaseFirestore.Firestore);
    getDetailAsync(clientId: string, programId: string, req: any): Promise<FirebaseFirestore.DocumentData | null | undefined>;
}
