import { HALSerializer } from 'hal-serializer'

export const serialize = (req: any, data: any) => {

  const baseUrl = req.apiUrls.baseUrl;

  const serializer = new HALSerializer();

  serializer.register('outreachResultSummary', {
    whitelist: [
      'id',
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

  serializer.register('outreachAttemptDetail', {
    whitelist: [
                  'id',
                  'displayName',
                  'outreachTag',
                  'channel',
                  'outreachStatus',
                  'firstAttemptAt',
                  'lastAttemptAt',
                  'attempts',
                  'lastBestResult'
                ],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/outreachAttempts/${data.id}`, rel: 'outreach' },
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
        type: 'outreachResultSummary',
      },
    },
  });

  const serialized = serializer.serialize('outreachAttemptDetail', data);
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
    self: { href: `${selfUrl}`, rel: 'collection:outreachAttempts' },
  };

  if (total > pageSize) {
    collectionLinks.first = {
      href: `${baseUrl}/clients/${data.clientId}/outreachAttempts`,
    };
    if (page > 1) {
      collectionLinks.prev = {
        href: `${baseUrl}/clients/${data.clientId}/outreachAttempts?page=${page - 1}`,
      };
    }
    if (page < pages) {
      collectionLinks.next = {
        href: `${baseUrl}/clients/${data.clientId}/outreachAttempts?page=${page + 1}`,
      };
    }
    if (page <= pages) {
      collectionLinks.last = {
        href: `${baseUrl}/clients/${data.clientId}/outreachAttempts?page=${pages}`,
      };
    }
  }

  const serializer = new HALSerializer();

  serializer.register('outreachAttemptCollection', {
    whitelist: [
                'id',
                'displayName',
                'channel',
                'outreachStatus',
                'firstAttemptAt',
                'lastAttemptAt',
                'attempts',
                'lastBestResult'
                ],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/outreachAttempts/${data.id}`, rel: 'outreachAttempt' },
      };
    },
    associations: function (data: any) {
      return {
        program: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`, rel: 'program', id: data.programId, title: data.programName },
        outreach: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}/outreaches/${data.outreachId}`, rel: 'program', id: data.outreachId, title: data.outreachName },
        enrollment: { href: `${baseUrl}/clients/${data.clientId}/enrollments/${data.enrollmentId}`, rel: 'enrollment', id: data.enrollmentId, title: data.displayName },
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

  const serialized = serializer.serialize('outreachAttemptCollection', displayData, {
    page: page,
    pageSize: pageSize,
    pages: pages,
    count: displayCount,
    total: total,
  });
  return serialized;
};
