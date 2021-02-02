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

  async getDetailAsync(clientId: string, outreachId: string, req: any) {
    const outreachDetail = await this.outreachDefRepository.getDetailAsync(clientId, outreachId);

    // ?? not sure if want this. list will be too big. not appropriate to embed
    // if (outreachDetail) {
    //   const outreachResultList = await this.outreachResultRepository.getListForOutreachAsync(outreachId)

    //   outreachDetail.outreachResults = outreachResultList.map( (outreachResult) => { return {
    //     outreachResultId: outreachResult.Id,
    //     _links: {
    //       self: `${req.apiUrls.baseUrl}/outreachResults/${outreachResult.id}` }
    //     }
    //   })
    // }

    return outreachDetail;
  }
}
