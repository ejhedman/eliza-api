import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { EnrollmentOutreachRepository } from '../repositories/enrollmentOutreachRepository';

export class EnrollmentQuery {
  db: FirebaseFirestore.Firestore;
  enrollmentRepository: EnrollmentRepository;
  outreachRepository: EnrollmentOutreachRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.enrollmentRepository = new EnrollmentRepository(db);
    this.outreachRepository = new EnrollmentOutreachRepository(db);
  }

  async getDetailAsync(clientId: string, id: string, req: any) {
    const enrollmentDetail = await this.enrollmentRepository.getDetailAsync(clientId, id);

    if (enrollmentDetail) {
      const outreachList = await this.outreachRepository.getListForEnrollmentAsync(clientId, id);
      enrollmentDetail.enrollmentOutreaches = outreachList.map((enrollmentOutreach) => {
        return {
          id: enrollmentOutreach.id,
          outreachId: enrollmentOutreach.outreachId,
          outreachName: enrollmentOutreach.outreachName,
          programId: enrollmentOutreach.programId,
          programName: enrollmentOutreach.programName,
          solutionId: enrollmentOutreach.solutionId,
          solutionName: enrollmentOutreach.solutionName,
          clientId: enrollmentOutreach.clientId,
          clientName: enrollmentOutreach.clientName,
          memberXid: enrollmentOutreach.memberXid,

          channel: enrollmentOutreach.channel,
          outreachStatus: enrollmentOutreach.outreachStatus,
          firstAttemptAt: enrollmentOutreach.firstAttemptAt,
          lastAttemptAt: enrollmentOutreach.lastAttemptAt,
          attempts: enrollmentOutreach.attempts,
          lastBestResult: enrollmentOutreach.lastBestResult,
        };
      });
    }
    return enrollmentDetail;
  }
}
