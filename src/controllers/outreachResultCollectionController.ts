import * as express from 'express';
import { OutreachResult } from '../models/outreachResult';
import { OutreachResultRepository } from '../repositories/outreachResultRepository';
import { OutreachResultQuery } from '../services/outreachResultQuery';
import { ControllerBase } from './controllerBase';

export class OutreachResultCollectionController extends ControllerBase {
  public path;
  public router = express.Router();

  db: FirebaseFirestore.Firestore;
  outreachResultRepository: OutreachResultRepository;
  outreachResultQuery: OutreachResultQuery;

  constructor(path: string, db: FirebaseFirestore.Firestore) {
    super();
    this.path = path;
    this.db = db;
    this.outreachResultRepository = new OutreachResultRepository(db);
    this.outreachResultQuery = new OutreachResultQuery(db);
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

    // list the outreachResult for given symbol
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
    const outreachResultes = await this.outreachResultRepository.getListAsync(clientId, filter);
    const serialized = OutreachResult.serializeCollection(req, outreachResultes);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }

  async getDetailAsync(req: any, res: any) {
    const clientId = req.params.id;
    const outreachResultId = req.params.id;
    const outreachResult = await this.outreachResultQuery.getDetailAsync(clientId, outreachResultId, req);
    const serialized = OutreachResult.serialize(req, outreachResult);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
