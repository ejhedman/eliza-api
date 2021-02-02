"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCollection = exports.serialize = void 0;
const hal_serializer_1 = require("hal-serializer");
const serialize = (req, data) => {
    const baseUrl = req.apiUrls.baseUrl;
    const selfUrl = req.apiUrls.selfUrl;
    const Serializer = new hal_serializer_1.HALSerializer();
    Serializer.register('programRef', {
        whitelist: ['id', 'displayName'],
        links: function (data) {
            return {
                self: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.id}` },
            };
        },
    });
    Serializer.register('solution', {
        whitelist: ['id', 'displayName', 'description'],
        links: function (record) {
            return {
                self: { href: `${selfUrl}`, rel: 'solution' },
            };
        },
        embedded: {
            programs: {
                type: 'programRef',
            },
        },
    });
    const serialized = Serializer.serialize('solution', data);
    return serialized;
};
exports.serialize = serialize;
const serializeCollection = (req, data) => {
    const baseUrl = req.apiUrls.baseUrl;
    const selfUrl = req.apiUrls.selfUrl;
    const total = data.length;
    let page = parseInt(req.query.page || '1', 10);
    if (page <= 1) {
        page = 1;
    }
    const pageSize = 25;
    const pages = Math.floor((total - 1) / pageSize) + 1;
    const start = (page - 1) * pageSize;
    const displayData = data.slice(start, start + pageSize);
    const displayCount = displayData.length;
    const collectionLinks = {
        self: { href: `${selfUrl}`, rel: 'collection:solutions' },
    };
    if (total > pageSize) {
        collectionLinks.first = {
            href: `${baseUrl}/clients/${data.clientId}/solutions`,
        };
        if (page > 1) {
            collectionLinks.prev = {
                href: `${baseUrl}/clients/${data.clientId}/solutions?page=${page - 1}`,
            };
        }
        if (page < pages) {
            collectionLinks.next = {
                href: `${baseUrl}/clients/${data.clientId}/solutions?page=${page + 1}`,
            };
        }
        if (page <= pages) {
            collectionLinks.last = {
                href: `${baseUrl}/clients/${data.clientId}/solutions?page=${pages}`,
            };
        }
    }
    const serializer = new hal_serializer_1.HALSerializer();
    serializer.register('solutions', {
        whitelist: ['id', 'displayName', 'description'],
        links: (record) => {
            return {
                self: { href: `${baseUrl}/solutions/${record.id}`, rel: 'solution' },
            };
        },
        topLevelLinks: collectionLinks,
        topLevelMeta: (extraOptions) => {
            return {
                page: extraOptions.page,
                pageSize: extraOptions.pageSize,
                pages: extraOptions.pages,
                count: extraOptions.count,
                total: extraOptions.total,
            };
        },
    });
    const serialized = serializer.serialize('solutions', displayData, {
        page,
        pageSize,
        pages,
        count: displayCount,
        total,
    });
    return serialized;
};
exports.serializeCollection = serializeCollection;
