import {
  customFilter, 
  getTenantsById,
  removeDuplicatesByValue
} from './helpers';

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
  test('should remove duplicates by the value field and merge tenant arrays', () => {
    const input = [
      { value: 'college', label: 'College (Main)', tenant: 'Tenant 1' },
      { value: 'college', label: 'College (Main)', tenant: 'Tenant 2' },
      { value: 'university', label: 'University', tenant: 'Tenant 3' },
    ];

    const expectedOutput = [
      { value: 'college', label: 'College', tenant: ['Tenant 1', 'Tenant 2'] },
      { value: 'university', label: 'University', tenant: ['Tenant 3'] },
    ];

    const result = removeDuplicatesByValue(input);
    expect(result).toEqual(expectedOutput);
  });

  test('should handle arrays with no duplicates correctly', () => {
    const input = [
      { value: 'college', label: 'College (Main)', tenant: 'Tenant 1' },
      { value: 'university', label: 'University', tenant: 'Tenant 2' },
    ];

    const expectedOutput = [
      { value: 'college', label: 'College (Main)', tenant: ['Tenant 1'] },
      { value: 'university', label: 'University', tenant: ['Tenant 2'] },
    ];

    const result = removeDuplicatesByValue(input);
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
