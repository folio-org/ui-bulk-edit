import { getMarcFormErrors } from './validation';
import { ACTIONS } from '../../../../constants/marcActions';
import { DATA_KEYS } from './helpers';

describe('getMarcFormErrors', () => {
  it('should return no errors for valid input', () => {
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

    const errors = getMarcFormErrors(validInput);
    expect(errors).toEqual({});
  });

  it('should return errors for invalid tag range', () => {
    const invalidInput = [
      {
        'id': '202',
        'tag': '111',
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

    const errors = getMarcFormErrors(invalidInput);
    expect(errors).toEqual({
      '[0].tag': 'ui-bulk-edit.layer.marc.error',
      '[0].subfield': 'ui-bulk-edit.layer.marc.error.subfield',
      '[0].actions[0].data[0].value': '[0].actions[0].data[0].value is a required field'
    });
  });


  it('should return errors for invalid tag range and invalid subfield value', () => {
    const invalidInput = [
      {
        id: '202',
        tag: '111',
        ind1: '\\',
        ind2: '\\',
        subfield: '',
        actions: [
          {
            meta: { required: true },
            name: ACTIONS.ADD_TO_EXISTING,
            data: [
              {
                key: 'SUBFIELD',
                value: '!',
              }
            ]
          },
          {
            meta: { required: false },
            name: '',
            data: []
          }
        ],
        parameters: [],
        subfields: []
      }
    ];

    const errors = getMarcFormErrors(invalidInput);
    expect(errors).toEqual({
      '[0].tag': 'ui-bulk-edit.layer.marc.error',
      '[0].subfield': 'ui-bulk-edit.layer.marc.error.subfield',
      '[0].actions[0].data[0].value': 'ui-bulk-edit.layer.marc.error.subfield',
    });
  });
});
