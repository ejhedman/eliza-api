const HALSerializer = require('hal-serializer');

export const serialize = (req: any, data: any) => {
  const baseUrl = req.apiUrls.baseUrl;

  const serializer = new HALSerializer();

  serializer.register('enrollmentOutreachSummary', {
    whitelist: [
      'id',
      'displayName',
      'channel',
      'outreachStatus',
      'firstAttemptAt',
      'lastAttemptAt',
      'attempts',
      'lastBestResult',
    ],
    links: function (data: any) {
      return {
        self: {
          href: `${baseUrl}/clients/${data.clientId}/enrollmentOutreaches/${data.id}`,
          rel: 'enrollmentOutreach',
        },
      };
    },
  });

  serializer.register('enrollmentDetail', {
    whitelist: [
      'id',
      'receivedAt',
      'startedAt',
      'completedAt',
      'scubStatus',
      'scrubReason',
      'excluded',
      'excludedAt',
      'lastOutreachChannel',
      'lastOutreachAt',
      'lastOutreachResult',
      'lastOutreachResultCategory',

      'memberXid',
      'transactionXid',
      'groupXid',
      'firstName',
      'lastName',
      'dob',
      'gender',
    ],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/enrollments/${data.id}`, rel: 'enrollment' },
        enrollmentOutreaches: {
          href: `${baseUrl}/clients/${data.clientId}/enrollmentOutreaches?enrollmentId=${data.id}`,
          rel: 'collection:enrollmentOutreaches',
        },
        program: {
          href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`,
          rel: 'program',
          title: data.programName,
        },
      };
    },
    embedded: {
      enrollmentOutreaches: {
        type: 'enrollmentOutreachSummary',
      },
    },
  });

  const serialized = serializer.serialize('enrollmentDetail', data);
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
    self: { href: `${selfUrl}`, rel: 'collection:enrollments' },
  };

  if (total > pageSize) {
    collectionLinks.first = {
      href: `${baseUrl}/clients/${data.clientId}/enrollments`,
    };
    if (page > 1) {
      collectionLinks.prev = {
        href: `${baseUrl}/clients/${data.clientId}/enrollments?page=${page - 1}`,
      };
    }
    if (page < pages) {
      collectionLinks.next = {
        href: `${baseUrl}/clients/${data.clientId}/enrollments?page=${page + 1}`,
      };
    }
    if (page <= pages) {
      collectionLinks.last = {
        href: `${baseUrl}/clients/${data.clientId}/enrollments?page=${pages}`,
      };
    }
  }

  const serializer = new HALSerializer();

  serializer.register('enrollmentCollection', {
    whitelist: [
      'id',
      'receivedAt',
      'startedAt',
      'completedAt',
      'scubStatus',
      'scrubReason',
      'excluded',
      'excludedAt',
      'lastOutreachChannel',
      'lastOutreachAt',
      'lastOutreachResult',
      'lastOutreachResultCategory',

      'memberXid',
      'firstName',
      'lastName',
      'dob',
      'gender',
    ],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/enrollments/${data.id}`, rel: 'enrollment' },
        program: {
          href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`,
          rel: 'program',
          title: data.programName,
        },
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

  const serialized = serializer.serialize('enrollmentCollection', displayData, {
    page: page,
    pageSize: pageSize,
    pages: pages,
    count: displayCount,
    total: total,
  });
  return serialized;
};
