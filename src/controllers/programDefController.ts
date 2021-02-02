import * as express from 'express';
// import { Request, Response } from 'express'
import { ProgramDef } from '../models/programDef';
import { ProgramDefRepository } from '../repositories/programDefRepository';
import { ProgramDefQuery } from '../services/programDefQuery';
import { ControllerBase } from './controllerBase';

export class ProgramDefController extends ControllerBase {
  public path;
  public router = express.Router();

  db: FirebaseFirestore.Firestore;
  programRepository: ProgramDefRepository;
  programQuery: ProgramDefQuery;

  constructor(path: string, db: FirebaseFirestore.Firestore) {
    super();
    this.path = path;
    this.db = db;
    this.programRepository = new ProgramDefRepository(db);
    this.programQuery = new ProgramDefQuery(db);
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/`, async (req, res, next) => {
      try {
        await this.getListAsync(req, res);
      } catch (error) {
        res.sendStatus(500);
        next(error); // eslint-disable-line callback-return
      }
    });

    // list the program for given symbol
    this.router.get(`${this.path}/:id`, async (req, res, next) => {
      try {
        await this.getDetailAsync(req, res);
      } catch (error) {
        res.sendStatus(500);
        next(error); // eslint-disable-line callback-return
      }
    });
  }

  async getListAsync(req: any, res: any) {
    const clientId = req.params.clientId;
    const filter = req.query;
    const programs = await this.programRepository.getListAsync(clientId, filter);
    const serialized = ProgramDef.serializeCollection(req, programs);
    // serialized.links.home = `${req.apiUrls.baseUrl}`;
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }

  async getDetailAsync(req: any, res: any) {
    const clientId = req.params.id;
    const programId = req.params.id;
    const program = await this.programQuery.getDetailAsync(clientId, programId, req);
    const serialized = ProgramDef.serialize(req, program);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
