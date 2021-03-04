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

  serializer.register('enrollmentOutreachDetail', {
    whitelist: [
                  'id',
                  'outreachName',
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
        self: { href: `${baseUrl}/clients/${data.clientId}/enrollmentOutreaches/${data.id}`, rel: 'outreach' },
        program: {
          href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`,
          rel: 'program',
          title: data.programName,
        },
        outreach: {
          href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}/outreaches/${data.outreachId}`,
          rel: 'program',
          title: data.outreachName,
        },
      };
    },
    // associations: function (data: any) {
    //   return {
    //     program: {
    //       href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`,
    //       rel: 'program',
    //       title: data.programName,
    //     },
    //   };
    // },
    embedded: {
      outreachResults: {
        type: 'outreachResultSummary',
      },
    },
  });

  const serialized = serializer.serialize('enrollmentOutreachDetail', data);
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
    self: { href: `${selfUrl}`, rel: 'collection:enrollmentOutreaches' },
  };

  if (total > pageSize) {
    collectionLinks.first = {
      href: `${baseUrl}/clients/${data.clientId}/enrollmentOutreaches`,
    };
    if (page > 1) {
      collectionLinks.prev = {
        href: `${baseUrl}/clients/${data.clientId}/enrollmentOutreaches?page=${page - 1}`,
      };
    }
    if (page < pages) {
      collectionLinks.next = {
        href: `${baseUrl}/clients/${data.clientId}/enrollmentOutreaches?page=${page + 1}`,
      };
    }
    if (page <= pages) {
      collectionLinks.last = {
        href: `${baseUrl}/clients/${data.clientId}/enrollmentOutreaches?page=${pages}`,
      };
    }
  }

  const serializer = new HALSerializer();

  serializer.register('enrollmentOutreachCollection', {
    whitelist: [
                'id',
                'outreachName',
                'channel',
                'outreachStatus',
                'firstAttemptAt',
                'lastAttemptAt',
                'attempts',
                'lastBestResult'
                ],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/enrollmentOutreaches/${data.id}`, rel: 'enrollmentOutreach' },
        program: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`, rel: 'program', id: data.programId, title: data.programName },
        outreach: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}/outreaches/${data.outreachId}`, rel: 'program', id: data.outreachId, title: data.outreachName },
        enrollment: { href: `${baseUrl}/clients/${data.clientId}/enrollments/${data.enrollmentId}`, rel: 'enrollment', id: data.enrollmentId, title: data.displayName },
      };
    },
    // associations: function (data: any) {
    //   return {
    //     program: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`, rel: 'program', id: data.programId, title: data.programName },
    //     outreach: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}/outreaches/${data.outreachId}`, rel: 'program', id: data.outreachId, title: data.outreachName },
    //     enrollment: { href: `${baseUrl}/clients/${data.clientId}/enrollments/${data.enrollmentId}`, rel: 'enrollment', id: data.enrollmentId, title: data.displayName },
    //   };
    // },
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

  const serialized = serializer.serialize('enrollmentOutreachCollection', displayData, {
    page: page,
    pageSize: pageSize,
    pages: pages,
    count: displayCount,
    total: total,
  });
  return serialized;
};
