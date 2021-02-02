import { HALSerializer } from 'hal-serializer'

export const serialize = (req: any, data: any) => {
  const baseUrl = req.apiUrls.baseUrl;

  const Serializer = new HALSerializer();

  Serializer.register('outreachResult', {
    whitelist: [
      'channel',
      'outreachAt',
      'outreachResultCategory',
      'outreachResult',
      'isLastBest',
      'responses',
    ],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/outreachResults/${data.id}`, rel: 'outreachResult' },
      };
    },
    associations: function (data: any) {
      return {
        program: {
          href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`,
          rel: 'program',
          id: data.programId,
          title: data.programName,
        },
        outreach: {
          href: `${baseUrl}/clients/${data.clientId}/outreaches/${data.outreachId}`,
          rel: 'outreach',
          id: data.outreachId,
          title: data.outreachName,
        },
      };
    },
  });

  const serialized = Serializer.serialize('outreachResult', data);
  return serialized;
};

export const serializeCollection = (req: any, data: any) => {
  const baseUrl = req.apiUrls.baseUrl;
  const selfUrl = req.apiUrls.selfUrl;

  const total = data.length;

  if (data.length > 0) {
    data.clientId = data[0].clientId
  }


  let page = parseInt(req.query.page || '1');
  if (page <= 1) {
    page = 1;
  }

  const pageSize = 100;
  const pages = Math.floor((total - 1) / pageSize) + 1;
  const start = (page - 1) * pageSize;
  const displayData = data.slice(start, start + pageSize);
  const displayCount = displayData.length;

  const collectionLinks: any = {
    self: { href: `${selfUrl}`, rel: 'collection:outreachResults' },
  };

  if (total > pageSize) {
    collectionLinks.first = {
      href: `${baseUrl}/clients/${data.clientId}/outreachResults`,
    };
    if (page > 1) {
      collectionLinks.prev = {
        href: `${baseUrl}/clients/${data.clientId}/outreachResults?page=${page - 1}`,
      };
    }
    if (page < pages) {
      collectionLinks.next = {
        href: `${baseUrl}/clients/${data.clientId}/outreachResults?page=${page + 1}`,
      };
    }
    if (page <= pages) {
      collectionLinks.last = {
        href: `${baseUrl}/clients/${data.clientId}/outreachResults?page=${pages}`,
      };
    }
  }

  const Serializer = new HALSerializer();

  Serializer.register('outreachResults', {
    whitelist: [
      'channel',
      'outreachAt',
      'outreachResultCategory',
      'outreachResult',
      'isLastBest',
      'responses',
    ],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/outreachResults/${data.id}`, rel: 'outreachResult' },
      };
    },
    associations: function (data: any) {
      return {
        program: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`, rel: 'program', id: data.programId, title: data.programName },
        outreach: { href: `${baseUrl}/clients/${data.clientId}/outreaches/${data.outreachId}`, rel: 'outreach', id: data.outreachId, title: data.outreachName },
      };
    },
    topLevelLinks: collectionLinks,
    topLevelMeta: function (extraOptions: any) {
      return {
        page: extraOptions.page,
        pageSize: extraOptions.pageSize,
        pages: extraOptions.pages,
        count: extraOptions.count,
        total: extraOptions.total,
      };
    },
  });

  const serialized = Serializer.serialize('outreachResults', displayData, {
    page: page,
    pageSize: pageSize,
    pages: pages,
    count: displayCount,
    total: total,
  });
  return serialized;
};