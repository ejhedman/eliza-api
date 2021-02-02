"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramDef = void 0;
const serializer_1 = require("./serializer");
class ProgramDef {
    static serialize(req, data) {
        return serializer_1.serialize(req, data);
    }
    static serializeCollection(req, data) {
        return serializer_1.serializeCollection(req, data);
    }
}
exports.ProgramDef = ProgramDef;
