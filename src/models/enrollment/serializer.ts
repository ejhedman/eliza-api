import { HALSerializer } from 'hal-serializer'

export const serialize = (req: any, data: any) => {
  const baseUrl = req.apiUrls.baseUrl;

  const serializer = new HALSerializer();

  serializer.register('outreachAttemptSummary', {
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
  });

  serializer.register('enrollmentDetail', {
    whitelist: [
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
        'memberXid',
        'groupXid',
        'firstName',
        'lastName',
        'dob',
        'gender',

        'preferredLanguage',
        'email',
        'primaryPhone',
        'secondaryPhone',
        'address1',
        'address2',
        'city',
        'state',
        'postalCode',
        'lineOfBusiness',
        'allowedChannels',
        'allowedContactDays',

      ],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/enrollments/${data.id}`, rel: 'enrollment' },
        outreachAttempts: {
          href: `${baseUrl}/clients/${data.clientId}/outreachAttempts?enrollmentId=${data.id}`,
          rel: 'collection:outreachAttempts',
        },
      };
    },
    associations: function (data: any) {
      return {
        program: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`, rel: 'program', title: data.programName },
      };
    },
    embedded: {
      outreachAttempts: {
        type: 'outreachAttemptSummary',
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
