export const bulkEditLogsData = Array(50).fill(null).map((_, index) => [
  {
    id: index.toString(),
    operationType: 'Edit',
    entityType: 'Item',
    status: 'New',
    userId: 'Smith, Josh S',
    startTime: '11/12/2023 2:35AM',
    endTime: '10/12/2022 7:34AM',
    totalNumOfRecords: 100,
    processedNumOfRecords: 55,
    committedNumOfRecords: 20,
    editing: 'In app',
  },
  {
    id: (index + 1).toString(),
    operationType: 'Delete',
    entityType: 'Holdings',
    status: 'Completed',
    userId: 'Brown, Marry',
    startTime: '12/12/2022 7:34AM',
    endTime: '12/12/2022 7:34AM',
    totalNumOfRecords: 65,
    processedNumOfRecords: 12,
    committedNumOfRecords: 20,
    editing: 'In app',
  },
]).flat();

export const bulkEditLogsDataWithExpiredFlag = Array(50).fill(null).map((_, index) => [
  {
    id: index.toString(),
    operationType: 'Edit',
    entityType: 'Item',
    status: 'New',
    userId: 'Smith, Josh S',
    startTime: '11/12/2023 2:35AM',
    endTime: '10/12/2022 7:34AM',
    totalNumOfRecords: 100,
    processedNumOfRecords: 55,
    committedNumOfRecords: 20,
    editing: 'In app',
    expired: true,
  },
  {
    id: (index + 1).toString(),
    operationType: 'Delete',
    entityType: 'Holdings',
    status: 'Completed',
    userId: 'Brown, Marry',
    startTime: '12/12/2022 7:34AM',
    endTime: '12/12/2022 7:34AM',
    totalNumOfRecords: 65,
    processedNumOfRecords: 12,
    committedNumOfRecords: 20,
    editing: 'In app',
    expired: true,
  },
]).flat();

export const listUsers = {
  'header': [
    {
      'value': 'Status',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Last name',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'First name',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Barcode',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Patron group',
      'dataType': 'STRING',
      'visible': true,
    },
  ],
  'rows': Array(10).fill(null).map((_, index) => ({
    'row': [
      'Active',
      'Rick',
      'Psych',
      `${index}148573765`,
      'UC Department, Quarter',
    ],
  })),
};

export const listItems = {
  'header': [
    {
      'value': 'Barcode',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Status',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Item effective location',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Effective call number',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Item HRID',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Material type',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Permanent loan type',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Temporary loan type',
      'dataType': 'STRING',
      'visible': true,
    },
  ],
  'rows': Array(10).fill(null).map((_, index) => ({
    'row': [
      `${index}148573765`,
      'Checked out',
      'Main Library',
      'PR6056.I4588 B749 2016',
      'item000000000008',
      'book',
      'Can circulate',
      'Course reserves',
    ],
  })),
};

export const listHoldings = {
  'header': [
    {
      'value': 'Holdings HRID',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Permanent Location',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Temporary Location',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Call number prefix',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Call number',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Call number suffix',
      'dataType': 'STRING',
      'visible': true,
    },
    {
      'value': 'Holdings type',
      'dataType': 'STRING',
      'visible': true,
    },
  ],
  'rows': Array(10).fill(null).map((_, index) => ({
    'row': [
      `hold000000000002${index}`,
      'Main Library',
      'Location Temp',
      'A',
      '1958 A 8050',
      'B',
      'Physical',
    ],
  })),
};

export const errorsPreview = {
  errors: [
    {
      message: 'No match found',
      parameters: [
        {
          key: 'IDENTIFIER',
          value: 'invalid1',
        },
      ],
    },
  ],
};
