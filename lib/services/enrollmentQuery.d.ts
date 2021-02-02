import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { OutreachResultRepository } from '../repositories/outreachResultRepository';
export declare class EnrollmentQuery {
    db: FirebaseFirestore.Firestore;
    enrollmentRepository: EnrollmentRepository;
    outreachResultRepository: OutreachResultRepository;
    constructor(db: FirebaseFirestore.Firestore);
    getDetailAsync(clientId: string, id: string, req: any): Promise<FirebaseFirestore.DocumentData | null | undefined>;
}
