import { getFormErrors } from '../../../../utils/helpers';
import { ACTIONS } from '../../../../constants/marcActions';
import { DATA_KEYS } from './helpers';
import { validationSchema } from './validation';

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

    const errors = getFormErrors(validInput, validationSchema);
    expect(errors).toEqual({});
  });

  it('should return errors for invalid tag range', () => {
    const invalidInput = [
      {
        'id': '202',
        'tag': '005',
        'ind1': '\\',
        'ind2': '\\',
        'subfield': '',
        'actions': [
          {
            'name': ACTIONS.ADD_TO_EXISTING,
            'data': [
              {
                'key': DATA_KEYS.VALUE,
                'value': ''
              }
            ]
          },
          {
            'name': '',
            'data': []
          }
        ],
        'subfields': []
      }
    ];

    const errors = getFormErrors(invalidInput, validationSchema);
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
        tag: '005',
        ind1: '\\',
        ind2: '\\',
        subfield: '',
        actions: [
          {
            name: ACTIONS.ADD_TO_EXISTING,
            data: [
              {
                key: DATA_KEYS.SUBFIELD,
                value: '!',
              }
            ]
          },
          {
            name: '',
            data: []
          }
        ],
        subfields: []
      }
    ];

    const errors = getFormErrors(invalidInput, validationSchema);
    expect(errors).toEqual({
      '[0].subfield': 'ui-bulk-edit.layer.marc.error.subfield',
      '[0].actions[0].data[0].value': 'ui-bulk-edit.layer.marc.error.subfield',
      '[0].tag': 'ui-bulk-edit.layer.marc.error',
    });
  });

  it('should return errors for combination 999 + f + f - field is protected', () => {
    const invalidInput = [
      {
        id: '202',
        tag: '999',
        ind1: 'f',
        ind2: 'f',
        subfield: 'a',
        actions: [
          {
            name: ACTIONS.ADD_TO_EXISTING,
            data: [
              {
                key: DATA_KEYS.SUBFIELD,
                value: 'f',
              }
            ]
          },
          {
            name: ACTIONS.FIND,
            data: []
          }
        ],
        subfields: []
      }
    ];

    const errors = getFormErrors(invalidInput, validationSchema);
    expect(errors).toEqual({
      '[0].subfield': 'ui-bulk-edit.layer.marc.error.protected',
    });
  });

  it('should return errors when second action is required', () => {
    const invalidInput = [
      {
        id: '202',
        tag: '555',
        ind1: 'a',
        ind2: 'a',
        subfield: 'a',
        actions: [
          {
            name: ACTIONS.FIND,
            data: [
              {
                key: DATA_KEYS.VALUE,
                value: 'f',
              }
            ]
          },
          {
            name: '',
            data: []
          }
        ],
        subfields: []
      }
    ];

    const errors = getFormErrors(invalidInput, validationSchema);
    expect(errors).toEqual({
      '[0].actions[1].name': 'ui-bulk-edit.layer.marc.error.actionNameRequired',
    });
  });
});
