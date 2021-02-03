import { ClientDefRepository } from '../repositories/clientDefRepository';
import { ProgramDefRepository } from '../repositories/programDefRepository';

export class ClientDefQuery {
  db: FirebaseFirestore.Firestore;
  clientRepository: ClientDefRepository;
  programRepository: ProgramDefRepository;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.clientRepository = new ClientDefRepository(db);
    this.programRepository = new ProgramDefRepository(db);
  }

  async getDetailAsync(clientId: string, req: any) {
    const clientDetail = await this.clientRepository.getDetailAsync(clientId);

    if (clientDetail) {
      const programList = await this.programRepository.getListForClientAsync(clientId);

      clientDetail.programs = programList.map((program) => {
        return {
          id: program.id,
          displayName: program.displayName,
          clientId: program.clientId,
          clientName: program.clientName,
        };
      });
    }

    return clientDetail;
  }
}
