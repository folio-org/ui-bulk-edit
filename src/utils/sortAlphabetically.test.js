import {
  sortAlphabetically,
  sortAlphabeticallyWithoutGroups,
  sortAlphabeticallyComponentLabels
} from './sortAlphabetically';

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

describe('sortAlphabeticallyComponentLabels', () => {
  const formatMessage = jest.fn(({ id }) => {
    const messages = {
      'label1': 'Build',
      'label2': 'Change',
      'label3': 'Delete',
      'label4': 'Remove all'
    };
    return messages[id] || id;
  });

  it('should return an empty array if the input is undefined or null', () => {
    expect(sortAlphabeticallyComponentLabels(undefined, formatMessage)).toEqual([]);
    expect(sortAlphabeticallyComponentLabels(null, formatMessage)).toEqual([]);
  });

  it('should keep placeholders (empty values) at the top', () => {
    const input = [
      { value: '', label: { props: { id: 'placeholder' } } },
      { value: '1', label: { props: { id: 'label1' } } },
      { value: '2', label: { props: { id: 'label2' } } },
    ];

    const sorted = sortAlphabeticallyComponentLabels(input, formatMessage);
    expect(sorted[0].value).toBe('');
  });

  it('should sort labels alphabetically based on their translated values', () => {
    const input = [
      { value: '1', label: { props: { id: 'label3' } } },
      { value: '2', label: { props: { id: 'label1' } } },
      { value: '3', label: { props: { id: 'label2' } } },
    ];

    const sorted = sortAlphabeticallyComponentLabels(input, formatMessage);

    expect(sorted.map(item => item.label.props.id)).toEqual([
      'label1',
      'label2',
      'label3',
    ]);
  });

  it('should handle multiple placeholders correctly', () => {
    const input = [
      { value: '', label: { props: { id: 'placeholder1' } } },
      { value: '1', label: { props: { id: 'label4' } } },
      { value: '2', label: { props: { id: 'label1' } } },
    ];

    const sorted = sortAlphabeticallyComponentLabels(input, formatMessage);

    expect(sorted[0].value).toBe('');
    expect(sorted.map(item => item.label.props.id)).toEqual([
      'placeholder1',
      'label1',
      'label4',
    ]);
  });

  it('should not modify the original array', () => {
    const input = [
      { value: '1', label: { props: { id: 'label3' } } },
      { value: '2', label: { props: { id: 'label1' } } },
    ];

    const original = [...input];
    sortAlphabeticallyComponentLabels(input, formatMessage);

    expect(input).toEqual(original);
  });
});
