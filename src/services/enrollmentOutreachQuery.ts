import { EnrollmentOutreachRepository } from '../repositories/enrollmentOutreachRepository';
import { OutreachResultRepository } from '../repositories/outreachResultRepository';

export class EnrollmentOutreachQuery {
  db: FirebaseFirestore.Firestore;
  enrollmentOutreachRepository: EnrollmentOutreachRepository;
  outreachResultRepository: OutreachResultRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.enrollmentOutreachRepository = new EnrollmentOutreachRepository(db);
    this.outreachResultRepository = new OutreachResultRepository(db);
  }

  async getDetailAsync(clientId: string, enrollmentOutreachId: string, req: any) {
    const outreachDetail = await this.enrollmentOutreachRepository.getDetailAsync(clientId, enrollmentOutreachId);

    if (outreachDetail) {
      const outreachResults = await this.outreachResultRepository.getListForOutreachAsync(clientId, enrollmentOutreachId);

      outreachDetail.outreachResults = outreachResults.map((outreachResult) => {
        return {
          id: outreachResult.id,

          clientId: outreachResult.clientId,
          clientName: outreachResult.clientName,
          outreachId: outreachResult.outreachId,
          outreachName: outreachResult.outreachName,
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
