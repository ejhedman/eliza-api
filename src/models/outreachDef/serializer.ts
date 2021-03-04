import { HALSerializer } from 'hal-serializer'

export const serialize = (req: any, data: any) => {
  const baseUrl = req.apiUrls.baseUrl;
  const selfUrl = req.apiUrls.selfUrl;

  const serializer = new HALSerializer();

  serializer.register('outreahDef', {
    whitelist: ['id', 'displayName', 'description', 'channel'],
    links: function (record: any) {
      return {
        self: { href: `${selfUrl}`, rel: 'outreach' },
        enrollmentOutreaches: {
          href: `${baseUrl}/clients/${data.clientId}/enrollmentOutreaches?outreachId=${data.id}`,
          rel: 'collection:outreachResults',
        },
        program: {
          href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`,
          rel: 'program',
          title: data.programName,
        },      };
    },
    // associations: function (record: any) {
    //   return {
    //     program: {
    //       href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`,
    //       rel: 'program',
    //       title: data.programName,
    //     },
      // };
    // },
  });

  const serialized = serializer.serialize('outreahDef', data);
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

  const serializer = new HALSerializer();

  serializer.register('outreachDefCollection', {
    whitelist: ['id', 'displayName', 'description'],
    links: (record: any) => {
      return {
        self: { href: `${baseUrl}/clients/${record.clientId}/programs/${record.programId}/outreaches/${record.id}`, rel: 'outreach' },
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

  const serialized = serializer.serialize('outreachDefCollection', displayData, {
    page,
    pageSize,
    pages,
    count: displayCount,
    total,
  });
  return serialized;
};
