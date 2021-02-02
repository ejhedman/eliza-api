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
exports.SolutionDefQuery = void 0;
const solutionDefRepository_1 = require("../repositories/solutionDefRepository");
const programDefRepository_1 = require("../repositories/programDefRepository");
class SolutionDefQuery {
    constructor(db) {
        this.db = db;
        this.solutionRepository = new solutionDefRepository_1.SolutionDefRepository(db);
        this.programRepository = new programDefRepository_1.ProgramDefRepository(db);
    }
    getDetailAsync(clientId, solutionId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const solutionDetail = yield this.solutionRepository.getDetailAsync(clientId, solutionId);
            if (solutionDetail) {
                const programList = yield this.programRepository.getListForSolutionAsync(clientId, solutionId);
                solutionDetail.programs = programList.map((program) => {
                    return {
                        id: program.id,
                        displayName: program.displayName,
                    };
                });
            }
            return solutionDetail;
        });
    }
}
exports.SolutionDefQuery = SolutionDefQuery;
