import * as express from 'express';
// import { Request, Response } from 'express'
import { EnrollmentOutreach } from '../models/enrollmentOutreach';
import { EnrollmentOutreachRepository } from '../repositories/enrollmentOutreachRepository';
import { EnrollmentOutreachQuery } from '../services/enrollmentOutreachQuery';
import { ControllerBase } from './controllerBase';

export class EnrollmentOutreachCollectionController extends ControllerBase {
  public path;
  public router = express.Router();

  db: FirebaseFirestore.Firestore;
  outreachRepository: EnrollmentOutreachRepository;
  enrollmentOutreachQuery: EnrollmentOutreachQuery;

  constructor(path: string, db: FirebaseFirestore.Firestore) {
    super();
    this.path = path;
    this.db = db;
    this.outreachRepository = new EnrollmentOutreachRepository(db);
    this.enrollmentOutreachQuery = new EnrollmentOutreachQuery(db);
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

    // list the enrollmentOutreach for given symbol
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
    const enrollmentOutreaches = await this.outreachRepository.getListAsync(clientId, filter);
    const serialized = EnrollmentOutreach.serializeCollection(req, enrollmentOutreaches);
    // serialized.links.home = `${req.apiUrls.baseUrl}`;
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }

  async getDetailAsync(req: any, res: any) {
    const clientId = req.params.clientId;
    const enrollmentOutreachId = req.params.id;
    const enrollmentOutreach = await this.enrollmentOutreachQuery.getDetailAsync(clientId, enrollmentOutreachId, req);
    const serialized = EnrollmentOutreach.serialize(req, enrollmentOutreach);
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(serialized);
  }
}
