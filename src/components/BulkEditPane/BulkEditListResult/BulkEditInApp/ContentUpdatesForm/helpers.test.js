import { FormattedMessage } from 'react-intl';
import {
  ACTIONS,
  CONTROL_TYPES,
  OPTIONS,
  commonAdditionalActions,
  CAPABILITIES,
  PARAMETERS_KEYS,
} from '../../../../../constants';

import {
  ACTION_PARAMETERS_KEY,
  ACTION_VALUE_KEY,
  FIELD_VALUE_KEY,
  getContentUpdatesBody,
  getDefaultActions,
  getExtraActions,
  isContentUpdatesFormValid,
} from './helpers';

// Mock the functions
jest.mock('../../../../../constants', () => ({
  ...jest.requireActual('../../../../../constants'),
  getFindAction: jest.fn()
    .mockReturnValue({ value: 'find' }),
  getReplaceAction: jest.fn()
    .mockReturnValue({ value: 'replace' }),
  getBaseActions: jest.fn()
    .mockReturnValue([{ value: 'base' }]),
  getPlaceholder: jest.fn()
    .mockReturnValue({ value: 'placeholder' }),
  getSetToTrueAction: jest.fn()
    .mockReturnValue({ value: 'true' }),
  getSetToFalseAction: jest.fn()
    .mockReturnValue({ value: 'false' }),
  getMarkAsStuffOnlyAction: jest.fn()
    .mockReturnValue({ value: 'mark' }),
  getRemoveMarkAsStuffOnlyAction: jest.fn()
    .mockReturnValue({ value: 'remove' }),
  getRemoveAllAction: jest.fn()
    .mockReturnValue({ value: 'removeAll' }),
  getAddNoteAction: jest.fn()
    .mockReturnValue({ value: 'addNote' }),
  noteAdditionalActions: jest.fn()
    .mockReturnValue([{ value: 'note' }]),
}));

describe('ContentUpdatesForm helpers', () => {
  describe('isContentUpdatesFormValid', () => {
    it('should be invalid when content updates are not defined', () => {
      expect(isContentUpdatesFormValid())
        .toBeFalsy();
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

      expect(isContentUpdatesFormValid(contentUpdates))
        .toBeTruthy();
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

      expect(isContentUpdatesFormValid(contentUpdates))
        .toBeFalsy();
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

      expect(isContentUpdatesFormValid(contentUpdates))
        .toBeFalsy();
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
        }))
          .toEqual({
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
        }))
          .toEqual({
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
        const controlType = () => CONTROL_TYPES.INPUT;

        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.EMAIL_ADDRESS,
          options: [],
          capability: CAPABILITIES.USER,
          formatMessage,
        })))
          .toEqual(JSON.stringify({
            type: '',
            actions: [
              {
                actionsList: [{
                  value: ACTIONS.FIND,
                  label: <FormattedMessage id="ui-bulk-edit.actions.find" />,
                  disabled: false
                }],
                controlType,
                [ACTION_VALUE_KEY]: ACTIONS.FIND,
                [FIELD_VALUE_KEY]: '',
              },
              {
                actionsList: [{
                  value: ACTIONS.REPLACE_WITH,
                  label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                  disabled: false,
                }],
                controlType,
                [ACTION_VALUE_KEY]: ACTIONS.REPLACE_WITH,
                [FIELD_VALUE_KEY]: '',
              },
            ],
          }));
      });

      it('returns the correct object for the PATRON_GROUP option', () => {
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.PATRON_GROUP,
          options: [],
          capability: CAPABILITIES.USER,
          formatMessage,
        })))
          .toEqual(JSON.stringify({
            type: '',
            actions: [
              null,
              {
                actionsList: [{
                  value: ACTIONS.REPLACE_WITH,
                  label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                  disabled: false
                }],
                controlType: () => CONTROL_TYPES.PATRON_GROUP_SELECT,
                [ACTION_VALUE_KEY]: ACTIONS.REPLACE_WITH,
                [FIELD_VALUE_KEY]: '',
              },
            ],
          }));
      });

      it('returns the correct object for the EXPIRATION_DATE option', () => {
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.EXPIRATION_DATE,
          options: [],
          capability: CAPABILITIES.USER,
          formatMessage,
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: ACTIONS.REPLACE_WITH,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                    disabled: false,
                  }],
                  [ACTION_VALUE_KEY]: ACTIONS.REPLACE_WITH,
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      it('returns the correct object for the TEMPORARY_HOLDINGS_LOCATION option', () => {
        const controlType = () => CONTROL_TYPES.LOCATION;
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.TEMPORARY_HOLDINGS_LOCATION,
          options: [],
          formatMessage,
          capability: CAPABILITIES.HOLDING
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: '',
                    label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                    disabled: true,
                  },
                  {
                    value: ACTIONS.REPLACE_WITH,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                    disabled: false,
                  },
                  {
                    value: ACTIONS.CLEAR_FIELD,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.clear" />,
                    disabled: false,
                  },
                  ],
                  controlType,
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      it('returns the correct object for the PERMANENT_HOLDINGS_LOCATION option', () => {
        const controlType = () => CONTROL_TYPES.LOCATION;
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.PERMANENT_HOLDINGS_LOCATION,
          options: [],
          formatMessage,
          capability: CAPABILITIES.HOLDING
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: ACTIONS.REPLACE_WITH,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                    disabled: false,
                  }],
                  controlType,
                  [ACTION_VALUE_KEY]: ACTIONS.REPLACE_WITH,
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      it('returns the correct object for the TEMPORARY_LOCATION option', () => {
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.TEMPORARY_LOCATION,
          options: [],
          formatMessage,
          capability: CAPABILITIES.ITEM
        })))
          .toEqual(JSON.stringify({
            type: '',
            actions: [
              null,
              {
                actionsList: [{
                  value: '',
                  label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                  disabled: true,
                },
                {
                  value: ACTIONS.REPLACE_WITH,
                  label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                  disabled: false,
                },
                {
                  value: ACTIONS.CLEAR_FIELD,
                  label: <FormattedMessage id="ui-bulk-edit.layer.action.clear" />,
                  disabled: false,
                },
                ],
                controlType: () => CONTROL_TYPES.LOCATION,
                [ACTION_VALUE_KEY]: '',
                [FIELD_VALUE_KEY]: '',
              },
            ],
          }));
      });

      it('returns the correct object for the SUPPRESS_FROM_DISCOVERY for HOLDINGS option', () => {
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.SUPPRESS_FROM_DISCOVERY,
          options: [],
          formatMessage,
          capability: CAPABILITIES.HOLDING
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: '',
                    label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                    disabled: true,
                  }, {
                    value: ACTIONS.SET_TO_TRUE,
                    label: <FormattedMessage id="ui-bulk-edit.layer.options.items.true" />,
                    disabled: false,
                  }, {
                    value: ACTIONS.SET_TO_FALSE,
                    label: <FormattedMessage id="ui-bulk-edit.layer.options.items.false" />,
                    disabled: false,
                  }],
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                  [ACTION_PARAMETERS_KEY]: [
                    { key: PARAMETERS_KEYS.APPLY_TO_ITEMS, value: false }
                  ]
                },
              ],
            }),
          );
      });

      it('returns the correct object for the SUPPRESS_FROM_DISCOVERY for INSTANCE option', () => {
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.SUPPRESS_FROM_DISCOVERY,
          options: [],
          formatMessage,
          capability: CAPABILITIES.INSTANCE
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: '',
                    label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                    disabled: true,
                  }, {
                    value: ACTIONS.SET_TO_TRUE,
                    label: <FormattedMessage id="ui-bulk-edit.layer.options.items.true" />,
                    disabled: false,
                  }, {
                    value: ACTIONS.SET_TO_FALSE,
                    label: <FormattedMessage id="ui-bulk-edit.layer.options.items.false" />,
                    disabled: false,
                  }],
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                  [ACTION_PARAMETERS_KEY]: [
                    { key: PARAMETERS_KEYS.APPLY_TO_HOLDINGS, value: false },
                    { key: PARAMETERS_KEYS.APPLY_TO_ITEMS, value: false }
                  ]
                },
              ],
            }),
          );
      });


      it('returns the correct object for the PERMANENT_LOCATION option', () => {
        const controlType = () => CONTROL_TYPES.LOCATION;
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.PERMANENT_LOCATION,
          options: [],
          formatMessage,
          capability: CAPABILITIES.ITEM
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: '',
                    label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                    disabled: true,
                  },
                  {
                    value: ACTIONS.REPLACE_WITH,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                    disabled: false,
                  },
                  {
                    value: ACTIONS.CLEAR_FIELD,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.clear" />,
                    disabled: false,
                  },
                  ],
                  controlType,
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      it('returns the correct object for the STATUS option', () => {
        const controlType = () => CONTROL_TYPES.STATUS_SELECT;
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.STATUS,
          options: [],
          formatMessage,
          capability: CAPABILITIES.ITEM
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: ACTIONS.REPLACE_WITH,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                    disabled: false,
                  }],
                  controlType,
                  [ACTION_VALUE_KEY]: ACTIONS.REPLACE_WITH,
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      it('returns the correct object for the TEMPORARY_LOAN_TYPE option', () => {
        const controlType = () => CONTROL_TYPES.LOAN_TYPE;
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.TEMPORARY_LOAN_TYPE,
          options: [],
          formatMessage,
          capability: CAPABILITIES.ITEM
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: '',
                    label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                    disabled: true,
                  },
                  {
                    value: ACTIONS.REPLACE_WITH,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                    disabled: false,
                  },
                  {
                    value: ACTIONS.CLEAR_FIELD,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.clear" />,
                    disabled: false,
                  },
                  ],
                  controlType,
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      it('returns the correct object for the PERMANENT_LOAN_TYPE option', () => {
        const controlType = () => CONTROL_TYPES.LOAN_TYPE;
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.PERMANENT_LOAN_TYPE,
          options: [],
          formatMessage,
          capability: CAPABILITIES.ITEM
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: ACTIONS.REPLACE_WITH,
                    label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                    disabled: false,
                  }],
                  controlType,
                  [ACTION_VALUE_KEY]: ACTIONS.REPLACE_WITH,
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      const noteOptions = [
        OPTIONS.CHECK_IN_NOTE,
        OPTIONS.CHECK_OUT_NOTE,
      ];

      noteOptions.forEach(option => {
        it(`returns the correct object for the ${option} option`, () => {
          expect(JSON.stringify(getDefaultActions({
            option,
            options: [],
            formatMessage,
            capability: CAPABILITIES.ITEM
          })))
            .toEqual(
              JSON.stringify({
                type: '',
                actions: [
                  null,
                  {
                    actionsList: [
                      {
                        value: '',
                        label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                        disabled: true,
                      },
                      {
                        value: ACTIONS.MARK_AS_STAFF_ONLY,
                        label: <FormattedMessage id="ui-bulk-edit.layer.options.items.markAsStaffOnly" />,
                        disabled: false,
                      },
                      {
                        value: ACTIONS.REMOVE_MARK_AS_STAFF_ONLY,
                        label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeMarkAsStaffOnly" />,
                        disabled: false,
                      },
                      {
                        value: ACTIONS.ADD_TO_EXISTING,
                        label: <FormattedMessage id="ui-bulk-edit.layer.options.items.addNote" />,
                        disabled: false,
                      },
                      {
                        value: ACTIONS.REMOVE_ALL,
                        label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeAll" />,
                        disabled: false,
                      },
                      {
                        value: ACTIONS.FIND,
                        label: <FormattedMessage id="ui-bulk-edit.actions.findFullField" />,
                        disabled: false,
                      },
                      {
                        value: ACTIONS.CHANGE_TYPE,
                        label: <FormattedMessage id="ui-bulk-edit.layer.options.items.changeNote" />,
                        disabled: false,
                      },
                      {
                        value: ACTIONS.DUPLICATE,
                        label: <FormattedMessage id="ui-bulk-edit.layer.options.items.duplicateTo" />,
                        disabled: false,
                      },
                    ],
                    controlType: () => CONTROL_TYPES.TEXTAREA,
                    name: '',
                    [ACTION_VALUE_KEY]: '',
                    [FIELD_VALUE_KEY]: '',
                    [ACTION_PARAMETERS_KEY]: [
                      {
                        key: PARAMETERS_KEYS.STAFF_ONLY,
                        value: false,
                        onlyForActions: [ACTIONS.ADD_TO_EXISTING]
                      },
                    ]
                  },
                ],
              }),
            );
        });
      });

      it('returns the correct object for the HOLDINGS_NOTE option', () => {
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.HOLDINGS_NOTE,
          options: [],
          formatMessage,
          capability: CAPABILITIES.HOLDING,
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [{
                    value: '',
                    label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                    disabled: true,
                  },
                  {
                    value: ACTIONS.MARK_AS_STAFF_ONLY,
                    label: <FormattedMessage id="ui-bulk-edit.layer.options.items.markAsStaffOnly" />,
                    disabled: false,
                  },
                  {
                    value: ACTIONS.REMOVE_MARK_AS_STAFF_ONLY,
                    label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeMarkAsStaffOnly" />,
                    disabled: false,
                  },
                  {
                    value: ACTIONS.ADD_TO_EXISTING,
                    label: <FormattedMessage id="ui-bulk-edit.layer.options.items.addNote" />,
                    disabled: false,
                  },
                  {
                    value: ACTIONS.REMOVE_ALL,
                    label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeAll" />,
                    disabled: false,
                  },
                  {
                    value: ACTIONS.FIND,
                    label: <FormattedMessage id="ui-bulk-edit.actions.findFullField" />,
                    disabled: false,
                  },
                  {
                    value: ACTIONS.CHANGE_TYPE,
                    label: <FormattedMessage id="ui-bulk-edit.layer.options.items.changeNote" />,
                    disabled: false,
                  }],
                  controlType: (action) => {
                    return action === ACTIONS.CHANGE_TYPE
                      ? CONTROL_TYPES.NOTE_SELECT
                      : CONTROL_TYPES.TEXTAREA;
                  },
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                  [ACTION_PARAMETERS_KEY]: [
                    {
                      key: PARAMETERS_KEYS.STAFF_ONLY,
                      value: false,
                      onlyForActions: [ACTIONS.ADD_TO_EXISTING]
                    },
                  ]
                },
              ],
            }),
          );
      });

      it('returns the correct object for the ELECTRONIC_ACCESS_URL_RELATIONSHIP option', () => {
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.ELECTRONIC_ACCESS_URL_RELATIONSHIP,
          options: [],
          formatMessage,
          capability: CAPABILITIES.INSTANCE
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [
                    {
                      value: '',
                      label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                      disabled: true,
                    },
                    {
                      value: ACTIONS.CLEAR_FIELD,
                      label: <FormattedMessage id="ui-bulk-edit.layer.action.clear" />,
                      disabled: false,
                    },
                    {
                      value: ACTIONS.FIND,
                      label: <FormattedMessage id="ui-bulk-edit.actions.findFullField" />,
                      disabled: false,
                    },
                    {
                      value: ACTIONS.REPLACE_WITH,
                      label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                      disabled: false,
                    },
                  ],
                  controlType: () => CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT,
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      const electronicAccessOptions = [
        OPTIONS.ELECTRONIC_ACCESS_URI,
        OPTIONS.ELECTRONIC_ACCESS_MATERIALS_SPECIFIED,
        OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT,
        OPTIONS.ELECTRONIC_ACCESS_URL_PUBLIC_NOTE
      ];

      it('returns the correct object for the ELECTRONIC_ACCESS_URI option', () => {
        electronicAccessOptions.forEach(option => expect(JSON.stringify(getDefaultActions({
          option,
          options: [],
          formatMessage,
          capability: CAPABILITIES.INSTANCE
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [
                    {
                      value: '',
                      label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                      disabled: true,
                    },
                    {
                      value: ACTIONS.CLEAR_FIELD,
                      label: <FormattedMessage id="ui-bulk-edit.layer.action.clear" />,
                      disabled: false,
                    },
                    {
                      value: ACTIONS.FIND,
                      label: <FormattedMessage id="ui-bulk-edit.actions.findFullField" />,
                      disabled: false,
                    },
                    {
                      value: ACTIONS.REPLACE_WITH,
                      label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                      disabled: false,
                    },
                  ],
                  controlType: () => CONTROL_TYPES.TEXTAREA,
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          ));
      });

      it('returns the correct object for the ELECTRONIC_ACCESS_MATERIALS_SPECIFIED option', () => {
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.ELECTRONIC_ACCESS_MATERIALS_SPECIFIED,
          options: [],
          formatMessage,
          capability: CAPABILITIES.INSTANCE
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [
                    {
                      value: '',
                      label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                      disabled: true,
                    },
                    {
                      value: ACTIONS.CLEAR_FIELD,
                      label: <FormattedMessage id="ui-bulk-edit.layer.action.clear" />,
                      disabled: false,
                    },
                    {
                      value: ACTIONS.FIND,
                      label: <FormattedMessage id="ui-bulk-edit.actions.findFullField" />,
                      disabled: false,
                    },
                    {
                      value: ACTIONS.REPLACE_WITH,
                      label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
                      disabled: false,
                    },
                  ],
                  controlType: () => CONTROL_TYPES.TEXTAREA,
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      it('returns the correct object for the ELECTRONIC_ACCESS_MATERIALS_SPECIFIED option', () => {
        expect(JSON.stringify(getDefaultActions({
          option: OPTIONS.STATISTICAL_CODE,
          options: [],
          formatMessage,
          capability: CAPABILITIES.INSTANCE
        })))
          .toEqual(
            JSON.stringify({
              type: '',
              actions: [
                null,
                {
                  actionsList: [
                    {
                      value: '',
                      label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                      disabled: true,
                    },
                    {
                      value: ACTIONS.ADD_TO_EXISTING,
                      label: <FormattedMessage id="ui-bulk-edit.layer.options.add" />,
                      disabled: false,
                    },
                    {
                      value: ACTIONS.REMOVE_SOME,
                      label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeNote" />,
                      disabled: false,
                    },
                    {
                      value: ACTIONS.REMOVE_ALL,
                      label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeAll" />,
                      disabled: false,
                    },
                  ],
                  controlType: () => CONTROL_TYPES.STATISTICAL_CODES_SELECT,
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
                },
              ],
            }),
          );
      });

      it('returns the correct object for the default case', () => {
        expect(getDefaultActions({
          option: 'unknown',
          options: [],
          formatMessage,
          capability: CAPABILITIES.USER
        }))
          .toEqual({
            type: null,
            actions: [],
          });
      });
    });

    describe('getExtraActions', () => {
      const mockFormattedMessage = jest.fn();

      it('should return a certain structure for specific OPTIONS and ACTIONS - Notes', () => {
        const optionActionCombinations = [
          {
            option: OPTIONS.ITEM_NOTE,
            action: ACTIONS.FIND
          },
          {
            option: OPTIONS.ADMINISTRATIVE_NOTE,
            action: ACTIONS.FIND
          },
          {
            option: OPTIONS.CHECK_IN_NOTE,
            action: ACTIONS.FIND
          },
          {
            option: OPTIONS.CHECK_OUT_NOTE,
            action: ACTIONS.FIND
          },
        ];

        optionActionCombinations.forEach(({
          option,
          action
        }) => {
          const result = getExtraActions(option, action, mockFormattedMessage);
          const expectedFirstActionValue = commonAdditionalActions(mockFormattedMessage)[0].value;

          const expectedStructure = [{
            actionsList: commonAdditionalActions(mockFormattedMessage),
            controlType: () => CONTROL_TYPES.TEXTAREA,
            [ACTION_VALUE_KEY]: expectedFirstActionValue,
            [FIELD_VALUE_KEY]: '',
          }];

          expect(JSON.stringify(result))
            .toEqual(JSON.stringify(expectedStructure));
        });
      });

      it('should return a certain structure for specific OPTIONS and ACTIONS - URL Relationship', () => {
        const optionActionCombinations = [
          {
            option: OPTIONS.ELECTRONIC_ACCESS_URL_RELATIONSHIP,
            action: ACTIONS.FIND
          },
        ];

        optionActionCombinations.forEach(({
          option,
          action
        }) => {
          const result = getExtraActions(option, action, mockFormattedMessage);
          const expectedFirstActionValue = commonAdditionalActions(mockFormattedMessage)[0].value;

          const expectedStructure = [{
            actionsList: commonAdditionalActions(mockFormattedMessage),
            controlType: () => CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT,
            [ACTION_VALUE_KEY]: expectedFirstActionValue,
            [FIELD_VALUE_KEY]: '',
          }];

          expect(JSON.stringify(result))
            .toEqual(JSON.stringify(expectedStructure));
        });
      });

      describe('should return a certain structure for specific OPTIONS and ACTIONS - Notes (ITEM, HOLDING)', () => {
        const structure = JSON.stringify({
          type: '',
          actions: [
            null,
            {
              actionsList: [{
                value: '',
                label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
                disabled: true,
              }, {
                value: ACTIONS.MARK_AS_STAFF_ONLY,
                label: <FormattedMessage id="ui-bulk-edit.layer.options.items.markAsStaffOnly" />,
                disabled: false,
              }, {
                value: ACTIONS.REMOVE_MARK_AS_STAFF_ONLY,
                label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeMarkAsStaffOnly" />,
                disabled: false,
              }, {
                value: ACTIONS.ADD_TO_EXISTING,
                label: <FormattedMessage id="ui-bulk-edit.layer.options.items.addNote" />,
                disabled: false,
              },
              {
                value: ACTIONS.REMOVE_ALL,
                label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeAll" />,
                disabled: false,
              },
              {
                value: ACTIONS.FIND,
                label: <FormattedMessage id="ui-bulk-edit.actions.findFullField" />,
                disabled: false,
              },
              {
                value: ACTIONS.CHANGE_TYPE,
                label: <FormattedMessage id="ui-bulk-edit.layer.options.items.changeNote" />,
                disabled: false,
              }],
              [ACTION_VALUE_KEY]: '',
              [FIELD_VALUE_KEY]: '',
              [ACTION_PARAMETERS_KEY]: [
                {
                  key: PARAMETERS_KEYS.STAFF_ONLY,
                  value: false,
                  onlyForActions: [ACTIONS.ADD_TO_EXISTING]
                },
              ]
            },
          ],
        });

        it('returns the correct object for the ITEM_NOTE for ITEM option', () => {
          expect(JSON.stringify(getDefaultActions({
            option: OPTIONS.ITEM_NOTE,
            formatMessage: mockFormattedMessage,
            options: [],
            capability: CAPABILITIES.ITEM
          })))
            .toEqual(structure);
        });

        it('returns the correct object for the HOLDING_NOTE for HOLDING note option', () => {
          expect(JSON.stringify(getDefaultActions({
            option: OPTIONS.HOLDINGS_NOTE,
            formatMessage: mockFormattedMessage,
            options: [],
            capability: CAPABILITIES.HOLDING
          })))
            .toEqual(structure);
        });
      });

      it('should return an empty array for non-matching OPTIONS and ACTIONS', () => {
        const nonMatchingOption = 'NON_MATCHING_OPTION';
        const nonMatchingAction = 'NON_MATCHING_ACTION';

        const result = getExtraActions(nonMatchingOption, nonMatchingAction, mockFormattedMessage);
        expect(result)
          .toEqual([]);
      });
    });
  });
});
