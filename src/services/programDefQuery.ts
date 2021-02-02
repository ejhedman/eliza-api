import { ProgramDefRepository } from '../repositories/programDefRepository';
import { OutreachRepository } from '../repositories/outreachRepository';

export class ProgramDefQuery {
  db: FirebaseFirestore.Firestore;
  programRepository: ProgramDefRepository;
  outreachRepository: OutreachRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.programRepository = new ProgramDefRepository(db);
    this.outreachRepository = new OutreachRepository(db);
  }

  async getDetailAsync(clientId: string, programId: string, req: any) {
    const programDetail = await this.programRepository.getDetailAsync(clientId, programId);

    if (programDetail) {
      const outreachList = await this.outreachRepository.getListForProgramAsync(clientId, programId);

      programDetail.outreaches = outreachList.map((outreach) => {
        return {
          id: outreach.id,
          displayName: outreach.displayName,
          // _links: {
          //   self: `${req.apiUrls.baseUrl}/outreaches/${outreach.id}` }
        };
      });
    }
    return programDetail;
  }
}
