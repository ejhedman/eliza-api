import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { OutreachResultRepository } from '../repositories/outreachResultRepository';

export class EnrollmentQuery {
  db: FirebaseFirestore.Firestore;
  enrollmentRepository: EnrollmentRepository;
  outreachResultRepository: OutreachResultRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.enrollmentRepository = new EnrollmentRepository(db);
    this.outreachResultRepository = new OutreachResultRepository(db);
  }

  async getDetailAsync(clientId: string, id: string, req: any) {
    const enrollmentDetail = await this.enrollmentRepository.getDetailAsync(clientId, id);

    if (enrollmentDetail) {
      // const outreachResultList = await this.outreachResultRepository.getListForEnrollmentAsync(id);
      // enrollmentDetail.outreachResults = outreachResultList.map((outreachResult) => {
      //   return {
      //     id: outreachResult.id,
      //     programId: outreachResult.programId,
      //     programName: outreachResult.programName,
      //     solutionId: outreachResult.solutionId,
      //     solutionName: outreachResult.solutionName,
      //     memberXid: outreachResult.memberXid,
      //     batchId: outreachResult.batchId,
      //     jobId: outreachResult.jobId,
      //     result: outreachResult.result,
      //     resultDate: outreachResult.resultDate,
      //     status: outreachResult.status,
      //     responses: outreachResult.responses,
      //     _links: {
      //       self: `${req.apiUrls.baseUrl}/outreachResults/${outreachResult.id}`,
      //     },
      //   };
      // });
    }
    return enrollmentDetail;
  }
}
