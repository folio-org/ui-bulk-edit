import { sortAlphabetically, sortAlphabeticallyActions } from './sortAlphabetically';

describe('sortAlphabetically', () => {
  it('should sort the array alphabetically', () => {
    const inputArray = [
      { label: 'URL public note' },
      { label: 'Link text' },
      { label: 'Available' },
    ];

    const expectedOutput = [
      { label: 'Available' },
      { label: 'Link text' },
      { label: 'URL public note' },
    ];

    const result = sortAlphabetically(inputArray, '');

    expect(result).toEqual(expectedOutput);
  });

  it('should handle a placeholder value and move it to the beginning', () => {
    const inputArray = [
      { label: 'URL public note' },
      { label: 'Link text' },
      { label: 'Available' },
      { label: 'Placeholder' },
    ];

    const expectedOutput = [
      { label: 'Placeholder' },
      { label: 'Available' },
      { label: 'Link text' },
      { label: 'URL public note' },

    ];

    const result = sortAlphabetically(inputArray, 'Placeholder');

    expect(result).toEqual(expectedOutput);
  });
});

describe('sortAlphabeticallyActions', () => {
  it('should sort the array alphabetically with placeholder priority', () => {
    const array = [
      { label: 'Replace with' },
      { label: 'Clear field' },
      { label: 'Change note type' },
      { label: 'Placeholder' },
    ];

    const sortedArray = sortAlphabeticallyActions(array, 'Placeholder');

    // Your expected sorted array based on the logic in the function
    const expectedSortedArray = [
      { label: 'Placeholder' },
      { label: 'Change note type' },
      { label: 'Clear field' },
      { label: 'Replace with' },
    ];

    expect(sortedArray).toEqual(expectedSortedArray);
  });
});
