import { SolutionDefRepository } from '../repositories/solutionDefRepository';
import { ProgramDefRepository } from '../repositories/programDefRepository';

export class SolutionDefQuery {
  db: FirebaseFirestore.Firestore;
  solutionRepository: SolutionDefRepository;
  programRepository: ProgramDefRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.solutionRepository = new SolutionDefRepository(db);
    this.programRepository = new ProgramDefRepository(db);
  }

  async getDetailAsync(clientId: string, solutionId: string, req: any) {
    const solutionDetail = await this.solutionRepository.getDetailAsync(clientId, solutionId);

    if (solutionDetail) {
      const programList = await this.programRepository.getListForSolutionAsync(clientId, solutionId);

      solutionDetail.programs = programList.map((program) => {
        return {
          id: program.id,
          displayName: program.displayName,
        };
      });
    }
    return solutionDetail;
  }
}
