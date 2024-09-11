export const pcPostRequest = {
  url: '/organizations-storage/organizations',
  method: 'POST',
  tenants: [
    'central',
    'secondary',
  ],
  payload: {
    name: 'ORG-NAME',
    status: 'Active',
    code: 'ORG-CODE',
  },
};

export const pcPublicationDetails = {
  id: '88e88ef4-6917-4935-8965-0d36bce43a4a',
  status: 'IN_PROGRESS',
  dateTime: '2023-07-18T11:58:04.696254',
  request: '{\\"name\\":\\"ORG-NAME\\",\\"code\\":\\"ORG-CODE\\",\\"status\\":\\"Active\\"}',
};

export const pcPublicationResults = {
  publicationResults: [
    {
      tenantId: 'central',
      response: JSON.stringify({
        items: [{
          name: 'Test-1',
        }],
      }),
      statusCode: 200,
    },
    {
      tenantId: 'secondary',
      response: JSON.stringify({
        items: [{
          name: 'Test-2',
        }],
      }),
      statusCode: 200,
    },
  ],
  publicationErrors: [],
  totalRecords: 2,
};
