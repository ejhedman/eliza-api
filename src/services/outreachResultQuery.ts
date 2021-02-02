import { OutreachResultRepository } from '../repositories/outreachResultRepository';

export class OutreachResultQuery {
  db: FirebaseFirestore.Firestore;
  outreachResultRepository: OutreachResultRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.outreachResultRepository = new OutreachResultRepository(db);
  }

  async getDetailAsync(clientId: string, outreachResultId: string, req: any) {
    const outreachResultDetail = await this.outreachResultRepository.getDetailAsync(clientId, outreachResultId);
    return outreachResultDetail;
  }
}
