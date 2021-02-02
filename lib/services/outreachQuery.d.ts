import { OutreachRepository } from '../repositories/outreachRepository';
import { OutreachResultRepository } from '../repositories/outreachResultRepository';
export declare class OutreachQuery {
    db: FirebaseFirestore.Firestore;
    outreachRepository: OutreachRepository;
    outreachResultRepository: OutreachResultRepository;
    constructor(db: FirebaseFirestore.Firestore);
    getDetailAsync(clientId: string, outreachId: string, req: any): Promise<FirebaseFirestore.DocumentData | null | undefined>;
}
