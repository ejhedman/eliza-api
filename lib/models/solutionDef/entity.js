"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionDef = void 0;
const serializer_1 = require("./serializer");
class SolutionDef {
    static serialize(req, data) {
        return serializer_1.serialize(req, data);
    }
    static serializeCollection(req, data) {
        return serializer_1.serializeCollection(req, data);
    }
}
exports.SolutionDef = SolutionDef;
