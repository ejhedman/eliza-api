import { OutreachRepository } from '../repositories/outreachRepository';
import { OutreachResultRepository } from '../repositories/outreachResultRepository';

export class OutreachQuery {
  db: FirebaseFirestore.Firestore;
  outreachRepository: OutreachRepository;
  outreachResultRepository: OutreachResultRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.outreachRepository = new OutreachRepository(db);
    this.outreachResultRepository = new OutreachResultRepository(db);
  }

  async getDetailAsync(clientId: string, outreachId: string, req: any) {
    const outreachDetail = await this.outreachRepository.getDetailAsync(clientId, outreachId);

    // ?? not sure if want this. list will be too big. not appropriate to embed
    if (outreachDetail) {
      const outreachResults = await this.outreachResultRepository.getListForOutreachAsync(clientId, outreachId);

      outreachDetail.outreachResults = outreachResults.map((outreachResult) => {
        return {
          id: outreachResult.id,

          clientId: outreachResult.clientId,
          clientName: outreachResult.clientName,
          programId: outreachResult.programId,
          programName: outreachResult.programName,
          solutionId: outreachResult.solutionId,
          solutionName: outreachResult.solutionName,
          memberXid: outreachResult.memberXid,

          channel: outreachResult.channel,
          outreachAt: outreachResult.outreachAt,
          outreachResultCategory: outreachResult.outreachResultCategory,
          outreachResult: outreachResult.outreachResult,
          isLastBest: outreachResult.isLastBest,

          responses: outreachResult.responses,
        };
      });
    }

    return outreachDetail;
  }
}
