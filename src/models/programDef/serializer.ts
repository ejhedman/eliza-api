import { HALSerializer } from 'hal-serializer'

export const serialize = (req: any, data: any) => {
  const baseUrl = req.apiUrls.baseUrl;
  const selfUrl = req.apiUrls.selfUrl;

  const serializer = new HALSerializer();

  // EJH: HACK
  if (data) {
    data.isTransactional = false;

  }

  serializer.register('outreachDef', {
    whitelist: ['id', 'displayName'],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}/outreaches/${data.id}` },
      };
    },
  });

  serializer.register('programDef', {
    whitelist: ['id', 'displayName', 'description', 'isTransactional'],
    links: function (record: any) {
      return {
        self: { href: `${baseUrl}/clients/${record.clientId}/programs/${record.id}`, rel: 'program' },
        enrollments: { href: `${baseUrl}/clients/${record.clientId}/enrollments?programId=${record.id}` },
        enrollmentOutreaches: { href: `${baseUrl}/clients/${record.clientId}/enrollmentOutreaches?programId=${record.id}` },
        client: { href: `${baseUrl}/clients/${record.clientId}`, rel: 'client', title: data.clientName },
      };
    },
    // associations: function (record: any) {
    //   return {
    //     client: { href: `${baseUrl}/clients/${record.clientId}`, rel: 'client', title: data.clientName },
    //   };
    // },
    embedded: {
      outreaches: {
        type: 'outreachDef',
      },
    },
  });

  const serialized = serializer.serialize('programDef', data);
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

  const serializer = new HALSerializer();

  serializer.register('programCollection', {
    whitelist: ['id', 'displayName', 'description'],
    links: (record: any) => {
      return {
        self: { href: `${baseUrl}/clients/${record.clientId}/programs/${record.id}`, rel: 'program' },
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

  const serialized = serializer.serialize('programCollection', displayData, {
    page,
    pageSize,
    pages,
    count: displayCount,
    total,
  });
  return serialized;
};
