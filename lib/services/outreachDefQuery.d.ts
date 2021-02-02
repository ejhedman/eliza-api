import { OutreachDefRepository } from '../repositories/outreachDefRepository';
import { OutreachResultRepository } from '../repositories/outreachResultRepository';
export declare class OutreachDefQuery {
    db: FirebaseFirestore.Firestore;
    outreachDefRepository: OutreachDefRepository;
    outreachResultRepository: OutreachResultRepository;
    constructor(db: FirebaseFirestore.Firestore);
    getDetailAsync(clientId: string, outreachId: string, req: any): Promise<FirebaseFirestore.DocumentData | null | undefined>;
}
