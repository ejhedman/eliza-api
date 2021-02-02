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
exports.SolutionDefController = void 0;
const express = require("express");
// import { Request, Response } from 'express'
const solutionDef_1 = require("../models/solutionDef");
const solutionDefRepository_1 = require("../repositories/solutionDefRepository");
const solutionDefQuery_1 = require("../services/solutionDefQuery");
const controllerBase_1 = require("./controllerBase");
class SolutionDefController extends controllerBase_1.ControllerBase {
    constructor(path, db) {
        super();
        this.router = express.Router();
        this.path = path;
        this.db = db;
        this.solutionRepository = new solutionDefRepository_1.SolutionDefRepository(db);
        this.solutionQuery = new solutionDefQuery_1.SolutionDefQuery(db);
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
        // list the solution for given symbol
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
            const solutions = yield this.solutionRepository.getListAsync(clientId, filter);
            const serialized = solutionDef_1.SolutionDef.serializeCollection(req, solutions);
            // serialized.links.home = `${req.apiUrls.baseUrl}`;
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
    getDetailAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = req.params.id;
            const solutionId = req.params.id;
            const solution = yield this.solutionQuery.getDetailAsync(clientId, solutionId, req);
            const serialized = solutionDef_1.SolutionDef.serialize(req, solution);
            res.setHeader('Content-type', 'application/json');
            res.status(200).send(serialized);
        });
    }
}
exports.SolutionDefController = SolutionDefController;
