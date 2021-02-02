"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const log4js = require("log4js");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const firebase = require("firebase-admin");
const init_1 = require("./controllers/init");
const path = require("path");
const serviceAccount = require('../permissions.json');
class App {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        // setup firebase access
        if (firebase.apps.length === 0) {
            firebase.initializeApp({
                credential: firebase.credential.cert(serviceAccount),
                databaseURL: 'https://hedbot.firebaseio.com',
            });
        }
        // setup simple logging configuration
        log4js.configure({
            appenders: {
                console: { type: 'console' },
            },
            categories: { default: { appenders: ['console'], level: 'debug' } },
        });
        this.app = express();
        this.db = firebase.firestore();
        this.setupMiddleware();
        this.setupControllers();
        this.setupStatic();
    }
    setupMiddleware() {
        // simple middleware to set config base based on the incoming request.
        // (don't know how to get it before that). Used in serializers to generate
        // resource links
        this.app.use((req, res, next) => {
            // note: a bit touchy here to make it work with both google cloud functions
            // nad the emulator. The "baseUrl" is empty in google cloud functions.
            // const expressBase = req.baseUrl ? req.baseUrl : '/exchangeHandler'
            let proto;
            const forwardedProto = req.headers['X-Forwarded-Proto'];
            if (forwardedProto) {
                proto = forwardedProto;
            }
            else {
                proto = req.secure ? 'https:' : 'http:';
            }
            const expressBase = req.baseUrl;
            const url = proto + '//' + req.headers.host + expressBase;
            const baseUrl = url + this.baseUrl;
            const requestUrl = req.url === '/' ? '' : req.url;
            const selfUrl = `${proto}//${req.headers.host}${requestUrl}`;
            req.apiUrls = {
                baseUrl,
                requestUrl,
                selfUrl,
                appBase: expressBase.slice(1),
                proto,
                host: req.headers.host,
            };
            next();
        });
        const corsWithOpts = cors({ origin: true }); // HACK to control error error
        this.app.use(corsWithOpts);
        this.app.use(bodyParser.json());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }
    setupControllers() {
        init_1.initControllers(this.baseUrl, this.app, this.db);
    }
    setupStatic() {
        const thePath = path.join(__dirname, '../bin/spec');
        this.app.use('/eliza/api/spec', express.static(thePath));
        const swaggerPath = path.join(__dirname, '../bin/swagger-ui-dist');
        this.app.use('/eliza/api/swagger', express.static(swaggerPath));
        const docPath = path.join(__dirname, '../bin/doc/index.htm');
        this.app.use('/eliza/api/doc', express.static(docPath));
    }
}
exports.App = App;
