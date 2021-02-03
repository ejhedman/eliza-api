import { OutreachAttemptRepository } from '../repositories/outreachAttemptRepository';
import { OutreachResultRepository } from '../repositories/outreachResultRepository';

export class OutreachAttemptQuery {
  db: FirebaseFirestore.Firestore;
  outreachAttemptRepository: OutreachAttemptRepository;
  outreachResultRepository: OutreachResultRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.outreachAttemptRepository = new OutreachAttemptRepository(db);
    this.outreachResultRepository = new OutreachResultRepository(db);
  }

  async getDetailAsync(clientId: string, outreachAttemptId: string, req: any) {
    const outreachDetail = await this.outreachAttemptRepository.getDetailAsync(clientId, outreachAttemptId);

    // ?? not sure if want this. list will be too big. not appropriate to embed
    if (outreachDetail) {
      const outreachResults = await this.outreachResultRepository.getListForOutreachAsync(clientId, outreachAttemptId);

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
