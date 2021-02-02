"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCollection = exports.serialize = void 0;
const hal_serializer_1 = require("hal-serializer");
const serialize = (req, data) => {
    const baseUrl = req.apiUrls.baseUrl;
    const selfUrl = req.apiUrls.selfUrl;
    const Serializer = new hal_serializer_1.HALSerializer();
    // EJH: HACK
    data.isTransactional = false;
    Serializer.register('outreachRef', {
        whitelist: ['id', 'displayName'],
        links: function (data) {
            return {
                self: { href: `${baseUrl}/clients/${data.clientId}/outreaches/${data.id}` },
            };
        },
    });
    Serializer.register('program', {
        whitelist: ['id', 'displayName', 'description', 'isTransactional'],
        links: function (record) {
            return {
                self: { href: `${baseUrl}/clients/${record.clientId}/programs/${record.id}`, rel: 'program' },
                enrollments: { href: `${baseUrl}/clients/${record.clientId}/enrollments?programId=${record.id}` },
                outreaches: { href: `${baseUrl}/clients/${record.clientId}/outreaches?programId=${record.id}` },
            };
        },
        associations: function (record) {
            return {
                client: { href: `${baseUrl}/clients/${record.clientId}`, rel: 'client', title: data.clientName },
            };
        },
        embedded: {
            outreaches: {
                type: 'outreachRef',
            },
        },
    });
    const serialized = Serializer.serialize('program', data);
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
        self: { href: `${selfUrl}`, rel: 'collection:programs' },
    };
    if (total > pageSize) {
        collectionLinks.first = {
            href: `${baseUrl}/clients/${data.clientId}/programs`,
        };
        if (page > 1) {
            collectionLinks.prev = {
                href: `${baseUrl}/clients/${data.clientId}/programs?page=${page - 1}`,
            };
        }
        if (page < pages) {
            collectionLinks.next = {
                href: `${baseUrl}/clients/${data.clientId}/programs?page=${page + 1}`,
            };
        }
        if (page <= pages) {
            collectionLinks.last = {
                href: `${baseUrl}/clients/${data.clientId}/programs?page=${pages}`,
            };
        }
    }
    const serializer = new hal_serializer_1.HALSerializer();
    serializer.register('programs', {
        whitelist: ['id', 'displayName', 'description'],
        links: (record) => {
            return {
                self: { href: `${baseUrl}/clients/${data.clientId}/programs/${record.id}`, rel: 'program' },
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
    const serialized = serializer.serialize('programs', displayData, {
        page,
        pageSize,
        pages,
        count: displayCount,
        total,
    });
    return serialized;
};
exports.serializeCollection = serializeCollection;