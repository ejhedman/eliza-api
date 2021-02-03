import * as express from 'express';
// import { Request, Response } from 'express'
import { OutreachAttempt } from '../models/outreachAttempt';
import { OutreachAttemptRepository } from '../repositories/outreachAttemptRepository';
import { OutreachAttemptQuery } from '../services/outreachAttemptQuery';
import { ControllerBase } from './controllerBase';

export class OutreachAttemptCollectionController extends ControllerBase {
  public path;
  public router = express.Router();

  db: FirebaseFirestore.Firestore;
  outreachRepository: OutreachAttemptRepository;
  outreachAttemptQuery: OutreachAttemptQuery;

  constructor(path: string, db: FirebaseFirestore.Firestore) {
    super();
    this.path = path;
    this.db = db;
    this.outreachRepository = new OutreachAttemptRepository(db);
    this.outreachAttemptQuery = new OutreachAttemptQuery(db);
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

    // list the outreachAttempt for given symbol
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
    const outreachAttempts = await this.outreachRepository.getListAsync(clientId, filter);
    const serialized = OutreachAttempt.serializeCollection(req, outreachAttempts);
    // serialized.links.home = `${req.apiUrls.baseUrl}`;
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }

  async getDetailAsync(req: any, res: any) {
    const clientId = req.params.clientId;
    const outreachAttemptId = req.params.id;
    const outreachAttempt = await this.outreachAttemptQuery.getDetailAsync(clientId, outreachAttemptId, req);
    const serialized = OutreachAttempt.serialize(req, outreachAttempt);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
