import * as express from 'express';
import { ProgramDef } from '../models/programDef';
import { ProgramDefRepository } from '../repositories/programDefRepository';
import { ProgramDefQuery } from '../services/programDefQuery';
import { ControllerBase } from './controllerBase';

const stringify = require('csv-stringify');

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

    // Post batch to
    this.router.post(`${this.path}/:id`, async (req, res, next) => {
      try {
        await this.postBatch(req, res);
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

  async postBatch(req: any, res: any) {
    const clientId = req.params.clientId;
    const programId = req.params.id;

    const body = req.body;

    // NOTE: CSV will be generated with fields in order presented
    const mappings: any[] = [
      { source: 'batchXid',  header: 'BATCHID', required: true, },
      { source: 'clientId',  header: 'CUSTOMERNAME', required: true, },
      { source: 'lineOfBusiness',  header: 'LineOfBusiness', required: true,  default: '' },
      { source: 'memberXid',  header: 'MemberNumber', required: true, },
      { source: 'groupXid',  header: 'GROUPID', required: false, },
      { source: 'firstName',  header: 'FirstName', required: true, },
      { source: 'lastName',  header: 'LastName', required: true, },
      { source: 'primaryPhone',  header: 'PhoneNumber', required: true, },
      { source: 'secondaryPhone',  header: 'secondaryPhone', required: false, },
      { source: 'email',  header: 'Email', required: false, },
      { source: 'gender',  header: 'Gender', required: true, default: 'U'},
      { source: 'dob',  header: 'BirthDate', required: true, },
      { source: 'address1',  header: 'StreetAddress', required: false, },
      { source: 'address2',  header: 'StreetAddress2', required: false, },
      { source: 'city',  header: 'City', required: false, },
      { source: 'state',  header: 'State', required: false, },
      { source: 'postalCode',  header: 'ZipCode', required: false, },
      { source: 'programId',  header: 'PRODUCTID', required: true, },
      { source: 'preferredLanguage',  header: 'language', required: true, },
      { source: 'filter1',  header: 'PORTALFILTER1', required: true,  default: ''},
      { source: 'filter2',  header: 'PORTALFILTER2', required: true,  default: ''},
      { source: 'test',  header: 'test', required: false, },
      { source: 'transactionXid',  header: 'TransactionId', required: false, },
    ];

    const mappedBody = body.map((enrollment: any) => {

      enrollment.clientId = clientId
      enrollment.programId = programId

      // populate any missing required values that have defaults
      mappings.filter( (mapping) => mapping.required).forEach( (mapping) => {
        const key = mapping.source
        if (enrollment[key] === undefined) {
          enrollment[key] = mapping.default || ''
        }
      })

      const mappedValue: any = {};

      mappings.forEach( (mapping) => {
        if (mapping.required || enrollment[mapping.source]) {
          mappedValue[mapping.header] = enrollment[mapping.source]
        }
      })

      return mappedValue;
    });

    stringify(
      mappedBody,
      {
        header: true,
      },
      (err: any, output: any) => {
        if (err) {
          console.log(`Error: ${err}`);
          res.status(400).send(err);
        } else {
          res.setHeader('Content-type', 'text/csv');
          res.status(200).send(output);
        }
      },
    );
  }

}
