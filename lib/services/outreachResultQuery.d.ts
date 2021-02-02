import { OutreachResultRepository } from '../repositories/outreachResultRepository';
export declare class OutreachResultQuery {
    db: FirebaseFirestore.Firestore;
    outreachResultRepository: OutreachResultRepository;
    constructor(db: FirebaseFirestore.Firestore);
    getDetailAsync(clientId: string, outreachResultId: string, req: any): Promise<FirebaseFirestore.DocumentData | null | undefined>;
}
