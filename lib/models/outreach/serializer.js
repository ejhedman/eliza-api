"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCollection = exports.serialize = void 0;
const hal_serializer_1 = require("hal-serializer");
const serialize = (req, data) => {
    const baseUrl = req.apiUrls.baseUrl;
    const Serializer = new hal_serializer_1.HALSerializer();
    Serializer.register('outreachResult', {
        whitelist: [
            'channel',
            'outreachAt',
            'outreachResultCategory',
            'outreachResult',
            'isLastBest',
        ],
        links: function (data) {
            return {
                self: { href: `${baseUrl}/clients/${data.clientId}/outreachResults/${data.id}`, rel: 'outreachResult' },
            };
        },
    });
    Serializer.register('outreach', {
        whitelist: [
            'id',
            'displayName',
            'outreachTag',
            //'outreachName',
            'channel',
            'outreachStatus',
            'firstAttemptAt',
            'lasdtAttemptAt',
            'attempts',
            'lastBestResult'
        ],
        links: function (data) {
            return {
                self: { href: `${baseUrl}/clients/${data.clientId}/outreaches/${data.id}`, rel: 'outreach' },
            };
        },
        associations: function (data) {
            return {
                program: {
                    href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`,
                    rel: 'program',
                    title: data.programName,
                },
            };
        },
        embedded: {
            outreachResults: {
                type: 'outreachResult',
            },
        },
    });
    const serialized = Serializer.serialize('outreach', data);
    return serialized;
};
exports.serialize = serialize;
const serializeCollection = (req, data) => {
    const baseUrl = req.apiUrls.baseUrl;
    const selfUrl = req.apiUrls.selfUrl;
    const total = data.length;
    let page = parseInt(req.query.page || '1');
    if (page <= 1) {
        page = 1;
    }
    const pageSize = 100;
    const pages = Math.floor((total - 1) / pageSize) + 1;
    const start = (page - 1) * pageSize;
    const displayData = data.slice(start, start + pageSize);
    const displayCount = displayData.length;
    const collectionLinks = {
        self: { href: `${selfUrl}`, rel: 'collection:outreaches' },
    };
    if (total > pageSize) {
        collectionLinks.first = {
            href: `${baseUrl}/clients/${data.clientId}/outreaches`,
        };
        if (page > 1) {
            collectionLinks.prev = {
                href: `${baseUrl}/clients/${data.clientId}/outreaches?page=${page - 1}`,
            };
        }
        if (page < pages) {
            collectionLinks.next = {
                href: `${baseUrl}/clients/${data.clientId}/outreaches?page=${page + 1}`,
            };
        }
        if (page <= pages) {
            collectionLinks.last = {
                href: `${baseUrl}/clients/${data.clientId}/outreaches?page=${pages}`,
            };
        }
    }
    const Serializer = new hal_serializer_1.HALSerializer();
    Serializer.register('outreaches', {
        whitelist: [
            'id',
            'displayName',
            //'outreachTag',
            //'outreachName',
            'channel',
            'outreachStatus',
            'firstAttemptAt',
            'lasdtAttemptAt',
            'attempts',
            'lastBestResult'
        ],
        links: function (data) {
            return {
                self: { href: `${baseUrl}/clients/${data.clientId}/outreaches/${data.id}`, rel: 'outreach' },
            };
        },
        associations: function (data) {
            return {
                program: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`, rel: 'program', id: data.programId, title: data.programName },
            };
        },
        topLevelLinks: collectionLinks,
        topLevelMeta: function (extraOptions) {
            return {
                page: extraOptions.page,
                pageSize: extraOptions.pageSize,
                pages: extraOptions.pages,
                count: extraOptions.count,
                total: extraOptions.total,
            };
        },
    });
    const serialized = Serializer.serialize('outreaches', displayData, {
        page: page,
        pageSize: pageSize,
        pages: pages,
        count: displayCount,
        total: total,
    });
    return serialized;
};
exports.serializeCollection = serializeCollection;
