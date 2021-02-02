"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCollection = exports.serialize = void 0;
const hal_serializer_1 = require("hal-serializer");
const serialize = (req, data) => {
    const baseUrl = req.apiUrls.baseUrl;
    const selfUrl = req.apiUrls.selfUrl;
    const Serializer = new hal_serializer_1.HALSerializer();
    Serializer.register('outreach', {
        whitelist: ['id', 'displayName', 'description', 'channel'],
        links: function (record) {
            return {
                self: { href: `${selfUrl}`, rel: 'outreach' },
                outreaches: {
                    href: `${baseUrl}/clients/${data.clientId}/outreaches?outreachId=${data.id}`,
                    rel: 'collection:outreachResults',
                },
            };
        },
        associations: function (record) {
            return {
                program: {
                    href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`,
                    rel: 'program',
                    title: data.programName,
                },
            };
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
    const serializer = new hal_serializer_1.HALSerializer();
    serializer.register('outreaches', {
        whitelist: ['id', 'displayName', 'description'],
        links: (record) => {
            return {
                self: { href: `${baseUrl}/clients/${data.clientId}/outreaches/${record.id}`, rel: 'outreach' },
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
    const serialized = serializer.serialize('outreaches', displayData, {
        page,
        pageSize,
        pages,
        count: displayCount,
        total,
    });
    return serialized;
};
exports.serializeCollection = serializeCollection;
