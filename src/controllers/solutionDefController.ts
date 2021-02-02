import * as express from 'express';
// import { Request, Response } from 'express'
import { SolutionDef } from '../models/solutionDef';
import { SolutionDefRepository } from '../repositories/solutionDefRepository';
import { SolutionDefQuery } from '../services/solutionDefQuery';
import { ControllerBase } from './controllerBase';

export class SolutionDefController extends ControllerBase {
  public path;
  public router = express.Router();

  db: FirebaseFirestore.Firestore;
  solutionRepository: SolutionDefRepository;
  solutionQuery: SolutionDefQuery;

  constructor(path: string, db: FirebaseFirestore.Firestore) {
    super();
    this.path = path;

    this.db = db;
    this.solutionRepository = new SolutionDefRepository(db);
    this.solutionQuery = new SolutionDefQuery(db);
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

    // list the solution for given symbol
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
    const solutions = await this.solutionRepository.getListAsync(clientId, filter);

    const serialized = SolutionDef.serializeCollection(req, solutions);
    // serialized.links.home = `${req.apiUrls.baseUrl}`;
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }

  async getDetailAsync(req: any, res: any) {
    const clientId = req.params.id;
    const solutionId = req.params.id;
    const solution = await this.solutionQuery.getDetailAsync(clientId, solutionId, req);
    const serialized = SolutionDef.serialize(req, solution);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
