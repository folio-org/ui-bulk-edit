import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const usePreviewRecords = (id, capabilities, options = {}) => {
  const ky = useOkapiKy();
  const urlMapping = {
    users: 'users',
    items: 'items',
    holdings_record: 'holdings',
  };

  const { data } = useQuery(
    {
      queryKey: ['previewRecords', id],
      queryFn: async () => {
        const { users, items, totalRecords } = await ky.get(`bulk-edit/${id}/preview/${urlMapping[capabilities]}`, { searchParams: { limit: 10 } }).json();

        return {
          users,
          items,
          totalRecords,
        };
      },
      enabled: !!id,
      ...options,
    },
  );

  return ({
    items: data?.users || data?.items || [
      {
        'id': '0b1e3760-f689-493e-a98e-9cc9dadb7e83',
        '_version': 1,
        'hrid': 'ho13',
        'holdingsTypeId': '0c422f92-0f4d-4d32-8cbe-390ebc33a3e5',
        'formerIds': [
          'd1670310-ceac-47d9-aaba-aaeeb890bc07',
        ],
        'instanceId': '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
        'permanentLocationId': '53cf956f-c1df-410b-8bea-27f712cca7c0',
        'permanentLocation': null,
        'temporaryLocationId': '53cf956f-c1df-410b-8bea-27f712cca7c0',
        'effectiveLocationId': null,
        'electronicAccess': [
          {
            'uri': 'www.someurl.com',
            'linkText': 'link text',
            'materialsSpecification': 'material',
            'publicNote': 'www.someurl.com',
            'relationshipId': '3b430592-2e09-4b48-9a0c-0636d66b9fb3',
          },
        ],
        'callNumberTypeId': '512173a7-bd09-490e-b773-17d83f2b63fe',
        'callNumberPrefix': 'prefix',
        'callNumber': 'call number',
        'callNumberSuffix': 'suffix',
        'shelvingTitle': 'shelving title',
        'acquisitionFormat': 'order format',
        'acquisitionMethod': 'aquisition method',
        'receiptStatus': 'receipt status',
        'administrativeNotes': [
          'Test administrative note',
        ],
        'notes': [
          {
            'holdingsNoteTypeId': 'b160f13a-ddba-4053-b9c4-60ec5ea45d56',
            'holdingsNoteType': null,
            'note': 'a note',
            'staffOnly': false,
          },
          {
            'holdingsNoteTypeId': 'b160f13a-ddba-4053-b9c4-60ec5ea45d56',
            'holdingsNoteType': null,
            'note': 'a note',
            'staffOnly': true,
          },
        ],
        'illPolicyId': '9e49924b-f649-4b36-ab57-e66e639a9b0e',
        'illPolicy': null,
        'retentionPolicy': 'retention policy',
        'digitizationPolicy': 'digitisation policy',
        'holdingsStatements': [
          {
            'statement': 'statement',
            'note': 'statement public note',
            'staffNote': 'statement staff note',
          },
        ],
        'holdingsStatementsForIndexes': [
          {
            'statement': 'statement for indexes',
            'note': 'statement for indexes public note',
            'staffNote': 'statement for indexes staff note',
          },
        ],
        'holdingsStatementsForSupplements': [
          {
            'statement': 'statement for supplements',
            'note': 'statement for supplements public note',
            'staffNote': 'statement for supplements staff note',
          },
        ],
        'copyNumber': 'copy number',
        'numberOfItems': '10',
        'receivingHistory': {
          'displayType': null,
          'entries': [
            {
              'publicDisplay': true,
              'enumeration': 'enum',
              'chronology': 'chronology',
            },
            {
              'publicDisplay': null,
              'enumeration': 'enum2',
              'chronology': 'chronology2',
            },
          ],
        },
        'discoverySuppress': null,
        'statisticalCodeIds': [
          'b5968c9e-cddc-4576-99e3-8e60aed8b0dd',
        ],
        'tags': null,
        'metadata': null,
        'sourceId': 'f32d531e-df79-46b3-8932-cdd35f7a2264',
      },
    ],
    totalRecords: data?.totalRecords,
  });
};
