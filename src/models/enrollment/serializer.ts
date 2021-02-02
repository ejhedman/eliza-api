import { HALSerializer } from 'hal-serializer'

export const serialize = (req: any, data: any) => {
  const baseUrl = req.apiUrls.baseUrl;

  const Serializer = new HALSerializer();

  Serializer.register('enrollment', {
    whitelist: [
        'receivedAt',
        'startedAt',
        'lastContactAt',
        'completedAt',
        'scubStatus',
        'scrubReason',
        'excluded',
        'excludedAt',
        'transactionXid',
        'memberXid',
        'groupXid',
        'batchXid',
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
        'test',
    ],
    links: function (data: any) {
      return {
        self: { href: `${baseUrl}/clients/${data.clientId}/enrollments/${data.id}`, rel: 'enrollment' },
        outreaches: {
          href: `${baseUrl}/clients/${data.clientId}/outreaches?enrollmentId=${data.id}`,
          rel: 'collection:outreachResults',
        },
      };
    },
    associations: function (data: any) {
      return {
        program: { href: `${baseUrl}/clients/${data.clientId}/programs/${data.programId}`, rel: 'program', title: data.programName },
      };
    },
  });

  const serialized = Serializer.serialize('enrollment', data);
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

  const Serializer = new HALSerializer();

  Serializer.register('enrollments', {
    whitelist: [
      'receivedAt',
      'startedAt',
      'lastContactAt',
      'completedAt',
      'scubStatus',
      'scrubReason',
      'excluded',
      'excludedAt',
      'transactionXid',
      'memberXid',
      'email',
      'primaryPhone',
      'test'
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

  const serialized = Serializer.serialize('enrollments', displayData, {
    page: page,
    pageSize: pageSize,
    pages: pages,
    count: displayCount,
    total: total,
  });
  return serialized;
};