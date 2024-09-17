import {
  customFilter,
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
  it('should remove duplicates by value', () => {
    const input = [
      { value: 1, label: 'Item 1' },
      { value: 2, label: 'Item 2' },
      { value: 1, label: 'Item 1 (duplicate)' },
    ];
    const expectedOutput = [
      { value: 1, label: 'Item 1' },
      { value: 2, label: 'Item 2' },
    ];
    expect(removeDuplicatesByValue(input)).toEqual(expectedOutput);
  });

  it('should remove parentheses from label if duplicate is found', () => {
    const input = [
      { value: 1, label: 'Item 1 (original)' },
      { value: 1, label: 'Item 1 (duplicate)' },
    ];
    const expectedOutput = [
      { value: 1, label: 'Item 1' },
    ];
    expect(removeDuplicatesByValue(input)).toEqual(expectedOutput);
  });

  it('should handle empty array', () => {
    const input = [];
    const expectedOutput = [];
    expect(removeDuplicatesByValue(input)).toEqual(expectedOutput);
  });

  it('should handle array with unique values', () => {
    const input = [
      { value: 1, label: 'Item 1' },
      { value: 2, label: 'Item 2' },
      { value: 3, label: 'Item 3' },
    ];
    const expectedOutput = [
      { value: 1, label: 'Item 1' },
      { value: 2, label: 'Item 2' },
      { value: 3, label: 'Item 3' },
    ];
    expect(removeDuplicatesByValue(input)).toEqual(expectedOutput);
  });

  it('should handle array with all duplicates', () => {
    const input = [
      { value: 1, label: 'Item 1 (original)' },
      { value: 1, label: 'Item 1 (duplicate)' },
      { value: 1, label: 'Item 1 (another duplicate)' },
    ];
    const expectedOutput = [
      { value: 1, label: 'Item 1' },
    ];
    expect(removeDuplicatesByValue(input)).toEqual(expectedOutput);
  });
});
