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
exports.OutreachDefQuery = void 0;
const outreachDefRepository_1 = require("../repositories/outreachDefRepository");
const outreachResultRepository_1 = require("../repositories/outreachResultRepository");
class OutreachDefQuery {
    constructor(db) {
        this.db = db;
        this.outreachDefRepository = new outreachDefRepository_1.OutreachDefRepository(db);
        this.outreachResultRepository = new outreachResultRepository_1.OutreachResultRepository(db);
    }
    getDetailAsync(clientId, outreachId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const outreachDetail = yield this.outreachDefRepository.getDetailAsync(clientId, outreachId);
            // ?? not sure if want this. list will be too big. not appropriate to embed
            // if (outreachDetail) {
            //   const outreachResultList = await this.outreachResultRepository.getListForOutreachAsync(outreachId)
            //   outreachDetail.outreachResults = outreachResultList.map( (outreachResult) => { return {
            //     outreachResultId: outreachResult.Id,
            //     _links: {
            //       self: `${req.apiUrls.baseUrl}/outreachResults/${outreachResult.id}` }
            //     }
            //   })
            // }
            return outreachDetail;
        });
    }
}
exports.OutreachDefQuery = OutreachDefQuery;
