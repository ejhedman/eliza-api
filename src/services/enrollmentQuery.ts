import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { OutreachAttemptRepository } from '../repositories/outreachAttemptRepository';

export class EnrollmentQuery {
  db: FirebaseFirestore.Firestore;
  enrollmentRepository: EnrollmentRepository;
  outreachRepository: OutreachAttemptRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.enrollmentRepository = new EnrollmentRepository(db);
    this.outreachRepository = new OutreachAttemptRepository(db);
  }

  async getDetailAsync(clientId: string, id: string, req: any) {
    const enrollmentDetail = await this.enrollmentRepository.getDetailAsync(clientId, id);

    if (enrollmentDetail) {
      const outreachList = await this.outreachRepository.getListForEnrollmentAsync(clientId, id);
      enrollmentDetail.outreachAttempts = outreachList.map((outreachAttempt) => {
        return {
          id: outreachAttempt.id,
          displayName: outreachAttempt.displayName,
          programId: outreachAttempt.programId,
          programName: outreachAttempt.programName,
          solutionId: outreachAttempt.solutionId,
          solutionName: outreachAttempt.solutionName,
          clientId: outreachAttempt.clientId,
          clientName: outreachAttempt.clientName,
          memberXid: outreachAttempt.memberXid,
          // batchId: out reach.batchId,

          channel: outreachAttempt.channel,
          outreachStatus: outreachAttempt.outreachStatus,
          firstAttemptAt: outreachAttempt.firstAttemptAt,
          lastAttemptAt: outreachAttempt.lastAttemptAt,
          attempts: outreachAttempt.attempts,
          lastBestResult: outreachAttempt.lastBestResult,
        };
      });
    }
    return enrollmentDetail;
  }
}
