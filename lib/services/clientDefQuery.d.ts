import { ClientDefRepository } from '../repositories/clientDefRepository';
import { ProgramDefRepository } from '../repositories/programDefRepository';
export declare class ClientDefQuery {
    db: FirebaseFirestore.Firestore;
    clientRepository: ClientDefRepository;
    programRepository: ProgramDefRepository;
    constructor(db: FirebaseFirestore.Firestore);
    getDetailAsync(clientId: string, req: any): Promise<FirebaseFirestore.DocumentData | null | undefined>;
}
