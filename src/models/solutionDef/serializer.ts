import { HALSerializer } from 'hal-serializer'

export const serialize = (req: any, data: any) => {
  const baseUrl = req.apiUrls.baseUrl;
  const selfUrl = req.apiUrls.selfUrl;

  const Serializer = new HALSerializer();

  Serializer.register('programRef', {
    whitelist: ['id', 'displayName'],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.id}` },
      };
    },
  });

  Serializer.register('solution', {
    whitelist: ['id', 'displayName', 'description'],
    links: function (record: any) {
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

  const serializer = new HALSerializer();

  serializer.register('solutions', {
    whitelist: ['id', 'displayName', 'description'],
    links: (record: any) => {
      return {
        self: { href: `${baseUrl}/solutions/${record.id}`, rel: 'solution' },
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

  const serialized = serializer.serialize('solutions', displayData, {
    page,
    pageSize,
    pages,
    count: displayCount,
    total,
  });
  return serialized;
};
