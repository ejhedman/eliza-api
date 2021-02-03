import { ProgramDefRepository } from '../repositories/programDefRepository';
import { OutreachDefRepository } from '../repositories/outreachDefRepository';

export class ProgramDefQuery {
  db: FirebaseFirestore.Firestore;
  programRepository: ProgramDefRepository;
  outreachDefRepository: OutreachDefRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.programRepository = new ProgramDefRepository(db);
    this.outreachDefRepository = new OutreachDefRepository(db);
  }

  async getDetailAsync(clientId: string, programId: string, req: any) {
    const programDetail = await this.programRepository.getDetailAsync(clientId, programId);

    if (programDetail) {
      const outreachList = await this.outreachDefRepository.getListForProgramAsync(clientId, programId);

      programDetail.outreaches = outreachList.map((outreachDef) => {
        return {
          id: outreachDef.id,
          displayName: outreachDef.displayName,
          programId: outreachDef.programId,
          programName: outreachDef.programName,
          clientId: outreachDef.clientId,
          clientName: outreachDef.clientName
        };
      });
    }

    return programDetail;
  }
}
