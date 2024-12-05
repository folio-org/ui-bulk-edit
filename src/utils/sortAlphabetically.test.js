import { sortAlphabetically, sortAlphabeticallyWithoutGroups } from './sortAlphabetically';

describe('sortAlphabetically', () => {
  it('should sort the array alphabetically', () => {
    const inputArray = [
      { label: 'URL public note', value: 'URL public note' },
      { label: 'Link text', value: 'Link text' },
      { label: 'Available', value: 'Available' },
    ];

    const expectedOutput = [
      { label: 'Available', value: 'Available' },
      { label: 'Link text', value: 'Link text' },
      { label: 'URL public note', value: 'URL public note' },
    ];

    const result = sortAlphabetically(inputArray);

    expect(result).toEqual(expectedOutput);
  });

  it('should handle a placeholder value and move it to the beginning', () => {
    const inputArray = [
      { label: 'URL public note', value: 'URL public note' },
      { label: 'Link text', value: 'Link text' },
      { label: 'Available', value: 'Available' },
      { label: 'Placeholder', value: '' },
    ];

    const expectedOutput = [
      { label: 'Placeholder', value: '' },
      { label: 'Available', value: 'Available' },
      { label: 'Link text', value: 'Link text' },
      { label: 'URL public note', value: 'URL public note' },

    ];

    const result = sortAlphabetically(inputArray);

    expect(result).toEqual(expectedOutput);
  });
});

describe('sortAlphabeticallyActions', () => {
  it('should sort the array alphabetically with placeholder priority', () => {
    const array = [
      { label: 'Replace with', value: 'Replace with' },
      { label: 'Clear field', value: 'Clear field' },
      { label: 'Change note type', value: 'Change note type' },
      { label: 'Placeholder', value: '' },
    ];

    const sortedArray = sortAlphabeticallyWithoutGroups(array);

    // Your expected sorted array based on the logic in the function
    const expectedSortedArray = [
      { label: 'Placeholder', value: '' },
      { label: 'Change note type', value: 'Change note type' },
      { label: 'Clear field', value: 'Clear field' },
      { label: 'Replace with', value: 'Replace with' },
    ];

    expect(sortedArray).toEqual(expectedSortedArray);
  });
});
