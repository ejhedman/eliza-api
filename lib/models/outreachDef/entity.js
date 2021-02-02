"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutreachDef = void 0;
const serializer_1 = require("./serializer");
class OutreachDef {
    static serialize(req, data) {
        return serializer_1.serialize(req, data);
    }
    static serializeCollection(req, data) {
        return serializer_1.serializeCollection(req, data);
    }
}
exports.OutreachDef = OutreachDef;
