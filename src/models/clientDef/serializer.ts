const HALSerializer = require('hal-serializer');

export const serialize = (req: any, data: any) => {
  const baseUrl = req.apiUrls.baseUrl;

  const serializer = new HALSerializer();

  serializer.register('programDef', {
    whitelist: ['id', 'displayName'],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.id}` },
      };
    },
  });

  serializer.register('clientDef', {
    whitelist: ['id', 'displayName', 'description'],
    links: function (record: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.id}`, rel: 'client' },
        enrollments: { href: `${baseUrl}/clients/${data.id}/enrollments` },
        enrollmentOutreaches: { href: `${baseUrl}/clients/${data.id}/enrollmentOutreaches` },
      };
    },
    embedded: {
      programs: {
        type: 'programDef',
      },
    },
  });

  const serialized = serializer.serialize('clientDef', data);
  return serialized;
};

export const serializeCollection = (req: any, data: any) => {
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

  const collectionLinks: any = {
    self: { href: `${selfUrl}`, rel: 'collection:clients' },
  };

  if (total > pageSize) {
    collectionLinks.first = {
      href: `${baseUrl}`,
    };
    if (page > 1) {
      collectionLinks.prev = {
        href: `${baseUrl}?page=${page - 1}`,
      };
    }
    if (page < pages) {
      collectionLinks.next = {
        href: `${baseUrl}?page=${page + 1}`,
      };
    }
    if (page <= pages) {
      collectionLinks.last = {
        href: `${baseUrl}?page=${pages}`,
      };
    }
  }

  const serializer = new HALSerializer();

  serializer.register('clientCollection', {
    whitelist: ['id', 'displayName', 'description'],
    links: (record: any) => {
      return {
        self: { href: `${baseUrl}/clients/${record.id}`, rel: 'client' },
      };
    },
    topLevelLinks: collectionLinks,
    topLevelMeta: (extraOptions: any) => {
      return {
        page: extraOptions.page,
        pageSize: extraOptions.pageSize,
        pages: extraOptions.pages,
        count: extraOptions.count,
        total: extraOptions.total,
      };
    },
  });

  const serialized = serializer.serialize('clientCollection', displayData, {
    page,
    pageSize,
    pages,
    count: displayCount,
    total,
  });
  return serialized;
};
