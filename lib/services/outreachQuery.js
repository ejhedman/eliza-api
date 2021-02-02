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
exports.OutreachQuery = void 0;
const outreachRepository_1 = require("../repositories/outreachRepository");
const outreachResultRepository_1 = require("../repositories/outreachResultRepository");
class OutreachQuery {
    constructor(db) {
        this.db = db;
        this.outreachRepository = new outreachRepository_1.OutreachRepository(db);
        this.outreachResultRepository = new outreachResultRepository_1.OutreachResultRepository(db);
    }
    getDetailAsync(clientId, outreachId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const outreachDetail = yield this.outreachRepository.getDetailAsync(clientId, outreachId);
            // ?? not sure if want this. list will be too big. not appropriate to embed
            if (outreachDetail) {
                const outreachResults = yield this.outreachResultRepository.getListForOutreachAsync(clientId, outreachId);
                outreachDetail.outreachResults = outreachResults.map((outreachResult) => {
                    return {
                        id: outreachResult.id,
                        clientId: outreachResult.clientId,
                        clientName: outreachResult.clientName,
                        programId: outreachResult.programId,
                        programName: outreachResult.programName,
                        solutionId: outreachResult.solutionId,
                        solutionName: outreachResult.solutionName,
                        memberXid: outreachResult.memberXid,
                        channel: outreachResult.channel,
                        outreachAt: outreachResult.outreachAt,
                        outreachResultCategory: outreachResult.outreachResultCategory,
                        outreachResult: outreachResult.outreachResult,
                        isLastBest: outreachResult.isLastBest,
                        responses: outreachResult.responses,
                    };
                });
            }
            return outreachDetail;
        });
    }
}
exports.OutreachQuery = OutreachQuery;
