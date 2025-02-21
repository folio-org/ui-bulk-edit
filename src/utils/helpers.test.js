import {
  customFilter,
  findRecordType,
  getTenantsById,
  getTransformedLogsFilterValue,
  removeDuplicatesByValue
} from './helpers';
import { CAPABILITIES, JOB_STATUSES, LOGS_FILTERS } from '../constants';

describe('customFilter', () => {
  const dataOptions = [
    {
      label: 'Category 1',
      options: [
        { label: 'Option 1-1' },
        { label: 'Option 1-2' },
      ],
    },
    {
      label: 'Category 2',
      options: [
        { label: 'Option 2-1' },
        { label: 'Option 2-2' },
      ],
    },
    {
      label: 'Category 3',
      options: [],
    },
    {
      label: 'Uncategorized Option',
    },
  ];

  it('should return an empty array when no match is found', () => {
    const value = 'NonExistent';
    const result = customFilter(value, dataOptions);
    expect(result).toEqual([]);
  });

  it('should filter options correctly when a match is found in nested options', () => {
    const value = '1-1';
    const expected = [
      {
        label: 'Category 1',
        options: [
          { label: 'Option 1-1' },
        ],
      },
    ];
    const result = customFilter(value, dataOptions);
    expect(result).toEqual(expected);
  });

  it('should include the category if the category label matches the value', () => {
    const value = 'Category 1';
    const expected = [
      {
        label: 'Category 1',
        options: [
          { label: 'Option 1-1' },
          { label: 'Option 1-2' },
        ],
      },
    ];
    const result = customFilter(value, dataOptions);
    expect(result).toEqual(expected);
  });

  it('should include uncategorized options if the label matches the value', () => {
    const value = 'Uncategorized';
    const expected = [
      {
        label: 'Uncategorized Option',
      },
    ];
    const result = customFilter(value, dataOptions);
    expect(result).toEqual(expected);
  });

  it('should perform a case-insensitive match', () => {
    const value = 'option 1-1';
    const expected = [
      {
        label: 'Category 1',
        options: [
          { label: 'Option 1-1' },
        ],
      },
    ];
    const result = customFilter(value, dataOptions);
    expect(result).toEqual(expected);
  });

  it('should return multiple matching categories and options', () => {
    const value = 'Option';
    const expected = [
      {
        label: 'Category 1',
        options: [
          { label: 'Option 1-1' },
          { label: 'Option 1-2' },
        ],
      },
      {
        label: 'Category 2',
        options: [
          { label: 'Option 2-1' },
          { label: 'Option 2-2' },
        ],
      },
      {
        label: 'Uncategorized Option',
      },
    ];
    const result = customFilter(value, dataOptions);
    expect(result).toEqual(expected);
  });
});

describe('removeDuplicatesByValue', () => {
  it('should remove duplicates by the value field, merge tenant arrays, and remove parentheses from labels', () => {
    const input = [
      { value: 'college', label: 'College (Main)', tenant: 'Tenant 1' },
      { value: 'college', label: 'College (Main)', tenant: 'Tenant 2' },
      { value: 'university', label: 'University', tenant: 'Tenant 3' },
    ];

    const expectedOutput = [
      { value: 'college', label: 'College', tenant: ['Tenant 1', 'Tenant 2'] },
      { value: 'university', label: 'University', tenant: ['Tenant 3'] },
    ];

    const result = removeDuplicatesByValue(input, ['Tenant 1', 'Tenant 2', 'Tenant 3']);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle arrays with no duplicates and leave labels unchanged if there are no parentheses', () => {
    const input = [
      { value: 'college', label: 'College', tenant: 'Tenant 1' },
      { value: 'university', label: 'University', tenant: 'Tenant 2' },
    ];

    const expectedOutput = [
      { value: 'college', label: 'College', tenant: ['Tenant 1'] },
      { value: 'university', label: 'University', tenant: ['Tenant 2'] },
    ];

    const result = removeDuplicatesByValue(input, ['Tenant 1', 'Tenant 2']);
    expect(result).toEqual(expectedOutput);
  });

  it('should remove parentheses from labels when tenants array has only one element', () => {
    const input = [
      { value: 'college', label: 'College (Main)', tenant: 'Tenant 1' },
      { value: 'university', label: 'University (Main)', tenant: 'Tenant 2' },
    ];

    const expectedOutput = [
      { value: 'college', label: 'College', tenant: ['Tenant 1'] },
      { value: 'university', label: 'University', tenant: ['Tenant 2'] },
    ];

    const result = removeDuplicatesByValue(input, ['Tenant 1']);
    expect(result).toEqual(expectedOutput);
  });

  it('should return results sorted by label in alphabetical order', () => {
    const input = [
      { value: 'university', label: 'University (Main)', tenant: 'Tenant 1' },
      { value: 'college', label: 'College (Main)', tenant: 'Tenant 2' },
    ];

    const expectedOutput = [
      { value: 'college', label: 'College (Main)', tenant: ['Tenant 2'] },
      { value: 'university', label: 'University (Main)', tenant: ['Tenant 1'] },
    ];

    const result = removeDuplicatesByValue(input, ['Tenant 1', 'Tenant 2']);
    expect(result).toEqual(expectedOutput);
  });
});



describe('getTenantsById', () => {
  const mockArray = [
    { value: 1, tenant: 'Tenant 1' },
    { value: 2, tenant: 'Tenant 2' },
    { value: 3, tenant: 'Tenant 3' },
  ];

  it('should return tenant', () => {
    const result = getTenantsById(mockArray, 2);
    expect(result).toBe('Tenant 2');
  });

  it('should return null if not matched id', () => {
    const result = getTenantsById(mockArray, 4);
    expect(result).toBeNull();
  });

  it('should return null if array is empty', () => {
    const result = getTenantsById([], 1);
    expect(result).toBeNull();
  });
});

describe('getTenantsById', () => {
  const mockData = [
    { value: 'college', tenant: 'Tenant 1' },
    { value: 'university', tenant: 'Tenant 2' },
    { value: 'consortium', tenant: 'Tenant 3' },
  ];

  it('should return tenant 1', () => {
    const result = getTenantsById(mockData, 'college');
    expect(result).toBe('Tenant 1');
  });

  it('should return null', () => {
    const result = getTenantsById(mockData, 'unknown');
    expect(result).toBeNull();
  });
});

describe('getTransformedLogsFilterValue', () => {
  it('should add INSTANCE_MARC to the array if INSTANCE is present', () => {
    const values = [CAPABILITIES.INSTANCE];
    const result = getTransformedLogsFilterValue(LOGS_FILTERS.CAPABILITY, values);
    expect(result).toContain(CAPABILITIES.INSTANCE);
    expect(result).toContain(CAPABILITIES.INSTANCE_MARC);
  });

  it('should not add INSTANCE_MARC if it is already present', () => {
    const values = [CAPABILITIES.INSTANCE, CAPABILITIES.INSTANCE_MARC];
    const result = getTransformedLogsFilterValue(LOGS_FILTERS.CAPABILITY, values);
    expect(result).toContain(CAPABILITIES.INSTANCE);
    expect(result).toContain(CAPABILITIES.INSTANCE_MARC);
    expect(result.length).toBe(2);
  });

  it('should remove INSTANCE_MARC from the array if INSTANCE is not present', () => {
    const values = [CAPABILITIES.INSTANCE_MARC, 'other_value'];
    const result = getTransformedLogsFilterValue(LOGS_FILTERS.CAPABILITY, values);
    expect(result).not.toContain(CAPABILITIES.INSTANCE_MARC);
    expect(result).toContain('other_value');
  });

  it('should return the same array if INSTANCE and INSTANCE_MARC are not present', () => {
    const values = ['other_value'];
    const result = getTransformedLogsFilterValue(LOGS_FILTERS.CAPABILITY, values);
    expect(result).toEqual(values);
  });

  it('should not modify the original input array', () => {
    const values = [CAPABILITIES.INSTANCE];
    const result = getTransformedLogsFilterValue(LOGS_FILTERS.CAPABILITY, values);
    expect(values).not.toContain(CAPABILITIES.INSTANCE_MARC);
    expect(result).toContain(CAPABILITIES.INSTANCE_MARC);
  });

  it('should not modify the original userID', () => {
    const values = 'userID';
    const result = getTransformedLogsFilterValue(LOGS_FILTERS.USER, values);
    expect(values).not.toContain(CAPABILITIES.INSTANCE_MARC);
    expect(result).toContain('userID');
  });

  it('should add REVIEWED_NO_MARC_RECORDS to the array if REVIEW_CHANGES is present', () => {
    const values = [JOB_STATUSES.REVIEW_CHANGES];
    const result = getTransformedLogsFilterValue(LOGS_FILTERS.STATUS, values);
    expect(result).toContain(JOB_STATUSES.REVIEW_CHANGES);
    expect(result).toContain(JOB_STATUSES.REVIEWED_NO_MARC_RECORDS);
  });

  it('should remove REVIEWED_NO_MARC_RECORDS from the array if REVIEW_CHANGES is not present', () => {
    const values = ['other_value'];
    const result = getTransformedLogsFilterValue(LOGS_FILTERS.STATUS, values);
    expect(result).not.toContain(JOB_STATUSES.REVIEWED_NO_MARC_RECORDS);
    expect(result).toContain('other_value');
  });
});

describe('findRecordType', () => {
  const formatMessageMock = jest.fn(({ id }) => `translated-${id}`);

  it('should find a record type matching by id', () => {
    const expectedId = 'd0213d22-32cf-490f-9196-d81c3c66e53f';
    const expectedLabelKey = 'ui-bulk-edit.entityType.composite_item_details';
    const expectedLabel = `translated-${expectedLabelKey}`;

    const recordTypes = [
      { id: expectedId, label: 'some-other-label' },
      { id: 'another-id', label: expectedLabel },
    ];

    const result = findRecordType(recordTypes, 'ITEM', formatMessageMock);
    expect(result).toEqual(recordTypes[0]);
    expect(formatMessageMock).toHaveBeenCalledWith({ id: expectedLabelKey });
  });

  it('should find a record type matching by label', () => {
    const expectedId = '6b08439b-4f8e-4468-8046-ea620f5cfb74';
    const expectedLabelKey = 'ui-bulk-edit.entityType.composite_instances';
    const expectedLabel = `translated-${expectedLabelKey}`;

    const recordTypes = [
      { id: 'non-matching-id', label: expectedLabel },
      { id: expectedId, label: 'other-label' },
    ];

    const result = findRecordType(recordTypes, 'INSTANCE', formatMessageMock);
    expect(result).toEqual(recordTypes[0]);
    expect(formatMessageMock).toHaveBeenCalledWith({ id: expectedLabelKey });
  });

  it('should return undefined if no record type matches', () => {
    const recordTypes = [
      { id: 'non-matching-id', label: 'non-matching-label' },
    ];
    const result = findRecordType(recordTypes, 'ITEM', formatMessageMock);
    expect(result).toBeUndefined();
  });

  it('should return undefined if recordTypes is undefined', () => {
    const result = findRecordType(undefined, 'ITEM', formatMessageMock);
    expect(result).toBeUndefined();
  });
});
