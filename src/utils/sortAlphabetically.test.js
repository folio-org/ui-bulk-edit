import { sortAlphabetically } from './sortAlphabetically';

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
      { label: 'URL public note' },
      { label: 'Link text' },
      { label: 'Available' },
    ];

    const result = sortAlphabetically(inputArray, 'Placeholder');

    expect(result).toEqual(expectedOutput);
  });
});
