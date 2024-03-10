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
                  disabled: false,
                  label: undefined
                }],
                controlType,
                [ACTION_VALUE_KEY]: ACTIONS.FIND,
                [FIELD_VALUE_KEY]: '',
              },
              {
                actionsList: [{
                  value: ACTIONS.REPLACE_WITH,
                  disabled: false,
                  label: undefined
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
                  label: undefined,
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
                    disabled: false
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
                    disabled: true,
                    label: undefined
                  },
                  {
                    value: ACTIONS.REPLACE_WITH,
                    disabled: false,
                    label: undefined,
                  },
                  {
                    value: ACTIONS.CLEAR_FIELD,
                    disabled: false,
                    label: undefined,
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
                    disabled: false,
                    label: undefined
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
                  disabled: true,
                  label: undefined
                },
                {
                  value: ACTIONS.REPLACE_WITH,
                  disabled: false,
                  label: undefined,
                },
                {
                  value: ACTIONS.CLEAR_FIELD,
                  disabled: false,
                  label: undefined,
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
                    disabled: true,
                    label: undefined
                  }, {
                    value: ACTIONS.SET_TO_TRUE,
                    disabled: false,
                    label: undefined
                  }, {
                    value: ACTIONS.SET_TO_FALSE,
                    disabled: false,
                    label: undefined
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
                    disabled: true,
                    label: undefined
                  }, {
                    value: ACTIONS.SET_TO_TRUE,
                    disabled: false,
                    label: undefined
                  }, {
                    value: ACTIONS.SET_TO_FALSE,
                    disabled: false,
                    label: undefined
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
                    disabled: true,
                    label: undefined
                  },
                  {
                    value: ACTIONS.REPLACE_WITH,
                    disabled: false,
                    label: undefined,
                  },
                  {
                    value: ACTIONS.CLEAR_FIELD,
                    disabled: false,
                    label: undefined,
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
                    disabled: false,
                    label: undefined
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
                    disabled: true,
                    label: undefined,
                  },
                  {
                    value: ACTIONS.REPLACE_WITH,
                    disabled: false,
                    label: undefined,
                  },
                  {
                    value: ACTIONS.CLEAR_FIELD,
                    disabled: false,
                    label: undefined,
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
                    disabled: false,
                    label: undefined
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
                        disabled: true,
                        label: undefined
                      },
                      {
                        value: ACTIONS.MARK_AS_STAFF_ONLY,
                        disabled: false,
                        label: undefined
                      },
                      {
                        value: ACTIONS.REMOVE_MARK_AS_STAFF_ONLY,
                        disabled: false,
                        label: undefined
                      },
                      {
                        value: ACTIONS.ADD_TO_EXISTING,
                        disabled: false,
                        label: undefined
                      },
                      {
                        value: ACTIONS.REMOVE_ALL,
                        disabled: false,
                        label: undefined
                      },
                      {
                        value: ACTIONS.FIND,
                        disabled: false,
                        label: undefined
                      },
                      {
                        value: ACTIONS.CHANGE_TYPE,
                        disabled: false,
                        label: undefined,
                      },
                      {
                        value: ACTIONS.DUPLICATE,
                        disabled: false,
                        label: undefined,
                      },
                    ],
                    controlType: () => CONTROL_TYPES.TEXTAREA,
                    name: '',
                    [ACTION_VALUE_KEY]: '',
                    [FIELD_VALUE_KEY]: '',
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
                    disabled: true,
                    label: undefined,
                  },
                  {
                    value: ACTIONS.MARK_AS_STAFF_ONLY,
                    disabled: false,
                    label: undefined
                  },
                  {
                    value: ACTIONS.REMOVE_MARK_AS_STAFF_ONLY,
                    disabled: false,
                    label: undefined
                  },
                  {
                    value: ACTIONS.ADD_TO_EXISTING,
                    disabled: false,
                    label: undefined
                  },
                  {
                    value: ACTIONS.REMOVE_ALL,
                    disabled: false,
                    label: undefined
                  },
                  {
                    value: ACTIONS.FIND,
                    disabled: false,
                    label: undefined
                  },
                  {
                    value: ACTIONS.CHANGE_TYPE,
                    disabled: false,
                    label: undefined,
                  },
                  ],
                  controlType: (action) => {
                    return action === ACTIONS.CHANGE_TYPE
                      ? CONTROL_TYPES.NOTE_SELECT
                      : CONTROL_TYPES.TEXTAREA;
                  },
                  [ACTION_VALUE_KEY]: '',
                  [FIELD_VALUE_KEY]: '',
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
                      disabled: true,
                      label: undefined
                    },
                    {
                      value: ACTIONS.CLEAR_FIELD,
                      disabled: false,
                      label: undefined,
                    },
                    {
                      value: ACTIONS.FIND,
                      disabled: false,
                      label: undefined,
                    },
                    {
                      value: ACTIONS.REPLACE_WITH,
                      disabled: false,
                      label: undefined,
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
                  actionsList: [{
                    value: '',
                    disabled: true,
                    label: undefined,
                  },
                  {
                    value: ACTIONS.CLEAR_FIELD,
                    disabled: false,
                    label: undefined
                  },
                  {
                    value: ACTIONS.FIND,
                    disabled: false,
                    label: undefined
                  },
                  {
                    value: ACTIONS.REPLACE_WITH,
                    disabled: false,
                    label: undefined
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
                  actionsList: [{
                    value: '',
                    disabled: true,
                    label: undefined,
                  },
                  {
                    value: ACTIONS.CLEAR_FIELD,
                    disabled: false,
                    label: undefined
                  },
                  {
                    value: ACTIONS.FIND,
                    disabled: false,
                    label: undefined
                  },
                  {
                    value: ACTIONS.REPLACE_WITH,
                    disabled: false,
                    label: undefined
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
