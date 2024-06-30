import { getMarkFormErrors } from './validation';
import { ACTIONS } from '../../../../constants/markActions';
import { DATA_KEYS } from './helpers';

describe('getMarkFormErrors', () => {
  test('should return no errors for valid input', () => {
    const validInput = [
      {
        'id': '202',
        'tag': '999',
        'ind1': '\\',
        'ind2': '\\',
        'subfield': 'e',
        'actions': [
          {
            'meta': { required: true },
            'name': ACTIONS.ADD_TO_EXISTING,
            'data': [
              {
                'key': 'VALUE',
                'value': 'test'
              }
            ]
          },
          {
            'meta': { required: false },
            'name': '',
            'data': []
          }
        ],
        'parameters': [],
        'subfields': []
      }
    ];

    const errors = getMarkFormErrors(validInput);
    expect(errors).toEqual({});
  });

  test('should return errors for invalid tag range', () => {
    const invalidInput = [
      {
        'id': '202',
        'tag': '111', // invalid
        'ind1': '\\',
        'ind2': '\\',
        'subfield': '',
        'actions': [
          {
            'meta': { required: true },
            'name': ACTIONS.ADD_TO_EXISTING,
            'data': [
              {
                'key': DATA_KEYS.VALUE,
                'value': ''
              }
            ]
          },
          {
            'meta': { required: false },
            'name': '',
            'data': []
          }
        ],
        'parameters': [],
        'subfields': []
      }
    ];

    const errors = getMarkFormErrors(invalidInput);
    expect(errors).toEqual({
      '[0].tag': 'ui-bulk-edit.layer.marc.error',
      '[0].subfield': '[0].subfield must be exactly 1 characters',
      '[0].actions[0].data[0].value': '[0].actions[0].data[0].value is a required field'
    });
  });
});
