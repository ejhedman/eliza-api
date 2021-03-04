import * as express from 'express';
// import { Request, Response } from 'express'
import { OutreachDef } from '../models/outreachDef';
import { OutreachDefRepository } from '../repositories/outreachDefRepository';
import { OutreachDefQuery } from '../services/outreachDefQuery';
import { ControllerBase } from './controllerBase';

export class OutreachDefController extends ControllerBase {
  public path;
  public router = express.Router();

  db: FirebaseFirestore.Firestore;
  outreachDefRepository: OutreachDefRepository;
  outreachDefQuery: OutreachDefQuery;

  constructor(path: string, db: FirebaseFirestore.Firestore) {
    super();
    this.path = path;
    this.db = db;
    this.outreachDefRepository = new OutreachDefRepository(db);
    this.outreachDefQuery = new OutreachDefQuery(db);
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
    const programId = req.params.programId;
    const filter = req.query;
    const enrollmentOutreaches = await this.outreachDefRepository.getListAsync(clientId, programId, filter);
    const serialized = OutreachDef.serializeCollection(req, enrollmentOutreaches);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }

  async getDetailAsync(req: any, res: any) {
    const clientId = req.params.id;
    const outreachDefId = req.params.id;
    const outreach = await this.outreachDefQuery.getDetailAsync(clientId, outreachDefId, req);
    const serialized = OutreachDef.serialize(req, outreach);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
