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
exports.ClientDefQuery = void 0;
const clientDefRepository_1 = require("../repositories/clientDefRepository");
const programDefRepository_1 = require("../repositories/programDefRepository");
class ClientDefQuery {
    constructor(db) {
        this.db = db;
        this.clientRepository = new clientDefRepository_1.ClientDefRepository(db);
        this.programRepository = new programDefRepository_1.ProgramDefRepository(db);
    }
    getDetailAsync(clientId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientDetail = yield this.clientRepository.getDetailAsync(clientId);
            if (clientDetail) {
                const programList = yield this.programRepository.getListForClientAsync(clientId);
                clientDetail.programs = programList.map((program) => {
                    return {
                        id: program.id,
                        displayName: program.displayName,
                    };
                });
            }
            return clientDetail;
        });
    }
}
exports.ClientDefQuery = ClientDefQuery;
