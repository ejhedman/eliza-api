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
    ],
    links: function (data: any) {
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
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/outreaches/${data.id}`, rel: 'outreach' },
      };
    },
    associations: function (data: any) {
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

export const serializeCollection = (req: any, data: any) => {
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

  const Serializer = new HALSerializer();

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
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/outreaches/${data.id}`, rel: 'outreach' },
      };
    },
    associations: function (data: any) {
      return {
        program: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`, rel: 'program', id: data.programId, title: data.programName },
        //enrollment: { href: `${baseUrl}/clients/${data.clientId}/enrollments/${data.enrollmentId}`, rel: 'enrollment', id: data.enrollmentId, title: data.displayName },
        //outreach: { href: `${baseUrl}/clients/${data.clientId}/outreaches/${data.id}`, rel: 'outreach', id: data.id, title: data.displayName },
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

  const serialized = Serializer.serialize('outreaches', displayData, {
    page: page,
    pageSize: pageSize,
    pages: pages,
    count: displayCount,
    total: total,
  });
  return serialized;
};
