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
exports.ProgramDefQuery = void 0;
const programDefRepository_1 = require("../repositories/programDefRepository");
const outreachRepository_1 = require("../repositories/outreachRepository");
class ProgramDefQuery {
    constructor(db) {
        this.db = db;
        this.programRepository = new programDefRepository_1.ProgramDefRepository(db);
        this.outreachRepository = new outreachRepository_1.OutreachRepository(db);
    }
    getDetailAsync(clientId, programId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const programDetail = yield this.programRepository.getDetailAsync(clientId, programId);
            if (programDetail) {
                const outreachList = yield this.outreachRepository.getListForProgramAsync(clientId, programId);
                programDetail.outreaches = outreachList.map((outreach) => {
                    return {
                        id: outreach.id,
                        displayName: outreach.displayName,
                    };
                });
            }
            return programDetail;
        });
    }
}
exports.ProgramDefQuery = ProgramDefQuery;
