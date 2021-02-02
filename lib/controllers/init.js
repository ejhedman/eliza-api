"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initControllers = void 0;
const homeController_1 = require("./homeController");
const baseController_1 = require("./baseController");
const apiController_1 = require("./apiController");
const clientDefController_1 = require("./clientDefController");
const solutionDefController_1 = require("./solutionDefController");
const programDefController_1 = require("./programDefController");
const outreachDefController_1 = require("./outreachDefController");
const enrollmentCollectionController_1 = require("./enrollmentCollectionController");
const outreachCollectionController_1 = require("./outreachCollectionController");
const outreachResultCollectionController_1 = require("./outreachResultCollectionController");
const initControllers = (baseUrl, app, db) => {
    const controllers = [
        new apiController_1.APIController('/'),
        new clientDefController_1.ClientDefController('/clients', db),
        new solutionDefController_1.SolutionDefController('/clients/:clientId/solutions', db),
        new programDefController_1.ProgramDefController('/clients/:clientId/programs', db),
        new outreachDefController_1.OutreachDefController('/clients/:clientId/programs/:programId/outreaches', db),
        new outreachCollectionController_1.OutreachCollectionController('/clients/:clientId/outreaches', db),
        new outreachResultCollectionController_1.OutreachResultCollectionController('/clients/:clientId/outreachResults', db),
        new enrollmentCollectionController_1.EnrollmentCollectionController('/clients/:clientId/enrollments', db),
    ];
    app.use('/', new homeController_1.HomeController('').router);
    app.use('/eliza', new baseController_1.BaseController('').router);
    controllers.forEach((controller) => {
        app.use(baseUrl, controller.router);
    });
};
exports.initControllers = initControllers;
