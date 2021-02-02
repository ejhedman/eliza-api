import * as express from 'express';
// import { Request, Response } from 'express'
import { Outreach } from '../models/outreach';
import { OutreachRepository } from '../repositories/outreachRepository';
import { OutreachQuery } from '../services/outreachQuery';
import { ControllerBase } from './controllerBase';

export class OutreachCollectionController extends ControllerBase {
  public path;
  public router = express.Router();

  db: FirebaseFirestore.Firestore;
  outreachRepository: OutreachRepository;
  outreachQuery: OutreachQuery;

  constructor(path: string, db: FirebaseFirestore.Firestore) {
    super();
    this.path = path;
    this.db = db;
    this.outreachRepository = new OutreachRepository(db);
    this.outreachQuery = new OutreachQuery(db);
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

    // list the outreach for given symbol
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
    const outreaches = await this.outreachRepository.getListAsync(clientId, filter);
    const serialized = Outreach.serializeCollection(req, outreaches);
    // serialized.links.home = `${req.apiUrls.baseUrl}`;
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }

  async getDetailAsync(req: any, res: any) {
    const clientId = req.params.id;
    const outreachId = req.params.id;
    const outreach = await this.outreachQuery.getDetailAsync(clientId, outreachId, req);
    const serialized = Outreach.serialize(req, outreach);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
