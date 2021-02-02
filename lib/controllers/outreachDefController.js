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
exports.OutreachDefController = void 0;
const express = require("express");
// import { Request, Response } from 'express'
const outreachDef_1 = require("../models/outreachDef");
const outreachDefRepository_1 = require("../repositories/outreachDefRepository");
const outreachDefQuery_1 = require("../services/outreachDefQuery");
const controllerBase_1 = require("./controllerBase");
class OutreachDefController extends controllerBase_1.ControllerBase {
    constructor(path, db) {
        super();
        this.router = express.Router();
        this.path = path;
        this.db = db;
        this.outreachRepository = new outreachDefRepository_1.OutreachDefRepository(db);
        this.outreachQuery = new outreachDefQuery_1.OutreachDefQuery(db);
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(`${this.path}/`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getListAsync(req, res);
            }
            catch (error) {
                res.sendStatus(500);
                next(error); // eslint-disable-line callback-return
            }
        }));
        // list the outreach for given symbol
        this.router.get(`${this.path}/:id`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getDetailAsync(req, res);
            }
            catch (error) {
                res.sendStatus(500);
                next(error); // eslint-disable-line callback-return
            }
        }));
    }
    getListAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = req.params.clientId;
            const filter = req.query;
            const outreaches = yield this.outreachRepository.getListAsync(clientId, filter);
            const serialized = outreachDef_1.OutreachDef.serializeCollection(req, outreaches);
            // serialized.links.home = `${req.apiUrls.baseUrl}`;
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
    getDetailAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = req.params.id;
            const outreachId = req.params.id;
            const outreach = yield this.outreachQuery.getDetailAsync(clientId, outreachId, req);
            const serialized = outreachDef_1.OutreachDef.serialize(req, outreach);
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
}
exports.OutreachDefController = OutreachDefController;
