import * as express from 'express';

import { HomeController } from './homeController';
import { ApiBaseController } from './apiBaseController';
import { APIController } from './apiController';
import { ClientDefController } from './clientDefController';
import { SolutionDefController } from './solutionDefController';
import { ProgramDefController } from './programDefController';
import { OutreachDefController } from './outreachDefController';
import { EnrollmentCollectionController } from './enrollmentCollectionController';
import { EnrollmentOutreachCollectionController } from './enrollmentOutreachCollectionController';
import { OutreachResultCollectionController } from './outreachResultCollectionController';

export const initControllers = (baseUrl: string, app: express.Application, db: FirebaseFirestore.Firestore) => {
  const controllers = [
    new APIController('/'),

    new ClientDefController('/clients', db),
    new SolutionDefController('/clients/:clientId/solutions', db),
    new ProgramDefController('/clients/:clientId/programs', db),
    new OutreachDefController('/clients/:clientId/programs/:programId/outreaches', db),

    new EnrollmentOutreachCollectionController('/clients/:clientId/enrollmentOutreaches', db),
    new OutreachResultCollectionController('/clients/:clientId/outreachResults', db),
    new EnrollmentCollectionController('/clients/:clientId/enrollments', db),
  ];

  app.use('/', new HomeController('').router);
  app.use('/eliza', new ApiBaseController('').router);
  controllers.forEach((controller) => {
    app.use(baseUrl, controller.router);
  });
};
