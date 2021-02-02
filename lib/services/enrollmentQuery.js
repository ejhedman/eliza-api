"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentQuery = void 0;
const enrollmentRepository_1 = require("../repositories/enrollmentRepository");
const outreachResultRepository_1 = require("../repositories/outreachResultRepository");
class EnrollmentQuery {
    constructor(db) {
        this.db = db;
        this.enrollmentRepository = new enrollmentRepository_1.EnrollmentRepository(db);
        this.outreachResultRepository = new outreachResultRepository_1.OutreachResultRepository(db);
    }
    getDetailAsync(clientId, id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollmentDetail = yield this.enrollmentRepository.getDetailAsync(clientId, id);
            if (enrollmentDetail) {
                // const outreachResultList = await this.outreachResultRepository.getListForEnrollmentAsync(id);
                // enrollmentDetail.outreachResults = outreachResultList.map((outreachResult) => {
                //   return {
                //     id: outreachResult.id,
                //     programId: outreachResult.programId,
                //     programName: outreachResult.programName,
                //     solutionId: outreachResult.solutionId,
                //     solutionName: outreachResult.solutionName,
                //     memberXid: outreachResult.memberXid,
                //     batchId: outreachResult.batchId,
                //     jobId: outreachResult.jobId,
                //     result: outreachResult.result,
                //     resultDate: outreachResult.resultDate,
                //     status: outreachResult.status,
                //     responses: outreachResult.responses,
                //     _links: {
                //       self: `${req.apiUrls.baseUrl}/outreachResults/${outreachResult.id}`,
                //     },
                //   };
                // });
            }
            return enrollmentDetail;
        });
    }
}
exports.EnrollmentQuery = EnrollmentQuery;
