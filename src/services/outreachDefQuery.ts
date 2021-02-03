import { OutreachDefRepository } from '../repositories/outreachDefRepository';
import { OutreachResultRepository } from '../repositories/outreachResultRepository';

export class OutreachDefQuery {
  db: FirebaseFirestore.Firestore;
  outreachDefRepository: OutreachDefRepository;
  outreachResultRepository: OutreachResultRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.outreachDefRepository = new OutreachDefRepository(db);
    this.outreachResultRepository = new OutreachResultRepository(db);
  }

  async getDetailAsync(clientId: string, outreachDefId: string, req: any) {
    const outreachDetail = await this.outreachDefRepository.getDetailAsync(clientId, outreachDefId);

    return outreachDetail;
  }
}
