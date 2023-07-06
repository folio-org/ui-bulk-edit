import {
  ACTIONS, CONTROL_TYPES,
  OPTIONS,
} from '../../../../../constants';

import {
  ACTION_VALUE_KEY, FIELD_VALUE_KEY,
  getContentUpdatesBody, getDefaultActions,
  isContentUpdatesFormValid,
} from './helpers';

// Mock the functions
jest.mock('../../../../../constants', () => ({
  ...jest.requireActual('../../../../../constants'),
  getFindAction: jest.fn().mockReturnValue({ value: 'find' }),
  getReplaceAction: jest.fn().mockReturnValue({ value: 'replace' }),
  getBaseActions: jest.fn().mockReturnValue([{ value: 'base' }]),
  getPlaceholder: jest.fn().mockReturnValue({ value: 'placeholder' }),
  getSetToTrueAction: jest.fn().mockReturnValue({ value: 'true' }),
  getSetToFalseAction: jest.fn().mockReturnValue({ value: 'false' }),
  getMarkAsStuffOnlyAction: jest.fn().mockReturnValue({ value: 'mark' }),
  getRemoveMarkAsStuffOnlyAction: jest.fn().mockReturnValue({ value: 'remove' }),
  getRemoveAllAction: jest.fn().mockReturnValue({ value: 'removeAll' }),
  getAddNoteAction: jest.fn().mockReturnValue({ value: 'addNote' }),
}));

describe('ContentUpdatesForm helpers', () => {
  describe('isContentUpdatesFormValid', () => {
    it('should be invalid when content updates are not defined', () => {
      expect(isContentUpdatesFormValid()).toBeFalsy();
    });

    it('should be valid when content updates are properly built', () => {
      const contentUpdates = [
        {
          option: OPTIONS.STATUS,
          actions: [{
            type: ACTIONS.CLEAR_FIELD,
          }],
        },
        {
          option: OPTIONS.PERMANENT_LOCATION,
          actions: [{
            type: ACTIONS.REPLACE_WITH,
            updated: 'date',
          }],
        },
        {
          option: OPTIONS.TEMPORARY_LOCATION,
          actions: [{
            type: ACTIONS.REPLACE_WITH,
            updated: 'date',
            initial: true,
          }],
        },
      ];

      expect(isContentUpdatesFormValid(contentUpdates)).toBeTruthy();
    });

    it('should be invalid when content updates contains action with initial = false', () => {
      const contentUpdates = [
        {
          option: OPTIONS.TEMPORARY_LOCATION,
          actions: [{
            type: ACTIONS.REPLACE_WITH,
            updated: 'date',
            initial: false,
          }],
        },
      ];

      expect(isContentUpdatesFormValid(contentUpdates)).toBeFalsy();
    });

    it('should be invalid when content updates contains non-clear action with updated is not defined', () => {
      const contentUpdates = [
        {
          option: OPTIONS.TEMPORARY_LOCATION,
          actions: [{
            type: ACTIONS.REPLACE_WITH,
          }],
        },
      ];

      expect(isContentUpdatesFormValid(contentUpdates)).toBeFalsy();
    });
  });

  describe('helpers', () => {
    describe('getContentUpdatesBody', () => {
      const bulkOperationId = 'bulkOperationId';
      const totalRecords = 5;

      it('should construct bulk edit apply rules', () => {
        const contentUpdates = [
          {
            option: OPTIONS.STATUS,
            actions: [{
              type: ACTIONS.CLEAR_FIELD,
            }],
          },
          {
            option: OPTIONS.PERMANENT_LOCATION,
            actions: [{
              type: ACTIONS.REPLACE_WITH,
              updated: 'date',
            }],
          },
          {
            option: OPTIONS.TEMPORARY_LOCATION,
            actions: [{
              type: ACTIONS.REPLACE_WITH,
              updated: 'data',
              initial: true,
            }],
          },
        ];

        expect(getContentUpdatesBody({
          contentUpdates,
          bulkOperationId,
          totalRecords,
        })).toEqual({
          bulkOperationRules: contentUpdates.map(c => ({
            bulkOperationId,
            rule_details: c,
          })),
          totalRecords,
        });
      });

      it('should covert holding location options to back-end options', () => {
        const contentUpdates = [
          {
            option: OPTIONS.TEMPORARY_HOLDINGS_LOCATION,
            actions: [{
              type: ACTIONS.REPLACE_WITH,
              updated: 'data',
              initial: true,
            }],
          },
        ];

        expect(getContentUpdatesBody({
          contentUpdates,
          bulkOperationId,
          totalRecords,
        })).toEqual({
          bulkOperationRules: [{
            bulkOperationId,
            rule_details: {
              option: OPTIONS.TEMPORARY_LOCATION,
              actions: [{
                type: ACTIONS.REPLACE_WITH,
                updated: 'data',
                initial: true,
              }],
            },
          }],
          totalRecords,
        });
      });
    });

    describe('getDefaultActions', () => {
      const formatMessage = jest.fn();

      it('returns the correct object for the EMAIL_ADDRESS option', () => {
        expect(getDefaultActions(OPTIONS.EMAIL_ADDRESS, [], formatMessage)).toEqual({
          type: '',
          actions: [
            {
              actionsList: [{ value: 'find' }],
              type: CONTROL_TYPES.INPUT,
              [ACTION_VALUE_KEY]: 'find',
              [FIELD_VALUE_KEY]: '',
            },
            {
              actionsList: [{ value: 'replace' }],
              type: CONTROL_TYPES.INPUT,
              [ACTION_VALUE_KEY]: 'replace',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the PATRON_GROUP option', () => {
        expect(getDefaultActions(OPTIONS.PATRON_GROUP, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'replace' }],
              type: CONTROL_TYPES.PATRON_GROUP_SELECT,
              [ACTION_VALUE_KEY]: 'replace',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the EXPIRATION_DATE option', () => {
        expect(getDefaultActions(OPTIONS.EXPIRATION_DATE, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'replace' }],
              type: CONTROL_TYPES.DATE,
              [ACTION_VALUE_KEY]: 'replace',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the TEMPORARY_HOLDINGS_LOCATION option', () => {
        expect(getDefaultActions(OPTIONS.TEMPORARY_HOLDINGS_LOCATION, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'base' }],
              type: CONTROL_TYPES.LOCATION,
              [ACTION_VALUE_KEY]: 'base',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the PERMANENT_HOLDINGS_LOCATION option', () => {
        expect(getDefaultActions(OPTIONS.PERMANENT_HOLDINGS_LOCATION, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'replace' }],
              type: CONTROL_TYPES.LOCATION,
              [ACTION_VALUE_KEY]: 'replace',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the TEMPORARY_LOCATION option', () => {
        expect(getDefaultActions(OPTIONS.TEMPORARY_LOCATION, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'base' }],
              type: CONTROL_TYPES.LOCATION,
              [ACTION_VALUE_KEY]: 'base',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the SUPPRESS_FROM_DISCOVERY option', () => {
        expect(getDefaultActions(OPTIONS.SUPPRESS_FROM_DISCOVERY, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'placeholder' }, { value: 'true' }, { value: 'false' }],
              type: CONTROL_TYPES.SUPPRESS_CHECKBOX,
              [ACTION_VALUE_KEY]: 'placeholder',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the PERMANENT_LOCATION option', () => {
        expect(getDefaultActions(OPTIONS.PERMANENT_LOCATION, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'base' }],
              type: CONTROL_TYPES.LOCATION,
              [ACTION_VALUE_KEY]: 'base',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the STATUS option', () => {
        expect(getDefaultActions(OPTIONS.STATUS, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'replace' }],
              type: CONTROL_TYPES.STATUS_SELECT,
              [ACTION_VALUE_KEY]: 'replace',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the TEMPORARY_LOAN_TYPE option', () => {
        expect(getDefaultActions(OPTIONS.TEMPORARY_LOAN_TYPE, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'base' }],
              type: CONTROL_TYPES.LOAN_TYPE,
              [ACTION_VALUE_KEY]: 'base',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      it('returns the correct object for the PERMANENT_LOAN_TYPE option', () => {
        expect(getDefaultActions(OPTIONS.PERMANENT_LOAN_TYPE, [], formatMessage)).toEqual({
          type: '',
          actions: [
            null,
            {
              actionsList: [{ value: 'replace' }],
              type: CONTROL_TYPES.LOAN_TYPE,
              [ACTION_VALUE_KEY]: 'replace',
              [FIELD_VALUE_KEY]: '',
            },
          ],
        });
      });

      const noteOptions = [
        OPTIONS.ITEM_NOTE,
        OPTIONS.ADMINISTRATIVE_NOTE,
      ];

      noteOptions.forEach(option => {
        it(`returns the correct object for the ${option} option`, () => {
          expect(getDefaultActions(option, [], formatMessage)).toEqual({
            type: '',
            actions: [
              null,
              {
                actionsList: [
                  { value: 'placeholder' },
                  { value: 'mark' },
                  { value: 'remove' },
                  { value: 'addNote' },
                  { value: 'removeAll' },
                ],
                type: CONTROL_TYPES.TEXTAREA,
                [ACTION_VALUE_KEY]: 'placeholder',
                [FIELD_VALUE_KEY]: '',
              },
            ],
          });
        });
      });

      it('returns the correct object for the default case', () => {
        expect(getDefaultActions('unknown', [], formatMessage)).toEqual({
          type: null,
          actions: [],
        });
      });
    });
  });
});
