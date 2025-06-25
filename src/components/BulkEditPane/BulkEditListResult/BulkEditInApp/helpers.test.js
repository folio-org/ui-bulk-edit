import {
  TEMPORARY_LOCATIONS,
  getFormattedDate,
  getContentUpdatesBody,
  getStatisticalCodeActionIndex,
  getFieldsWithRules,
  getActionsWithRules,
  getOptionsWithRules,
  getPreselectedValue,
  getLabelByValue,
  sortWithoutPlaceholder,
  getMappedContentUpdates,
  folioFieldTemplate,
} from './helpers';
import {
  OPTIONS,
  ACTIONS,
  getAddAction,
  getPlaceholder,
  getRemoveSomeAction
} from '../../../../constants';

describe('TEMPORARY_LOCATIONS', () => {
  it('should include both TEMP_LOC and TEMP_HOLD_LOC', () => {
    expect(TEMPORARY_LOCATIONS).toEqual([
      OPTIONS.TEMPORARY_LOCATION,
      OPTIONS.TEMPORARY_HOLDINGS_LOCATION,
    ]);
  });
});

describe('getFormattedDate', () => {
  it('appends 23:59:59 and returns UTC ISO ending .000Z', () => {
    const formatted = getFormattedDate('2025-06-24');
    expect(formatted).toBe('2025-06-24T23:59:59.000Z');
  });
});

describe('getContentUpdatesBody', () => {
  const bulkId = 'BULK1';
  it('maps a normal option, preserves updated as-is', () => {
    const body = getContentUpdatesBody({
      bulkOperationId: bulkId,
      totalRecords: 42,
      contentUpdates: [{
        option: OPTIONS.ADMINISTRATIVE_NOTE,
        tenants: ['t1'],
        actions: [
          { name: ACTIONS.FIND, updated: '2025-01-01', tenants: ['t1'] },
        ],
      }],
    });

    expect(body).toEqual({
      totalRecords: 42,
      bulkOperationRules: [
        {
          bulkOperationId: bulkId,
          rule_details: {
            option: OPTIONS.ADMINISTRATIVE_NOTE,
            tenants: ['t1'],
            actions: [
              { name: ACTIONS.FIND, updated: '2025-01-01', tenants: ['t1'] },
            ],
          },
        },
      ],
    });
  });

  it('formats updated with getFormattedDate when option is EXPIRATION_DATE', () => {
    const body = getContentUpdatesBody({
      bulkOperationId: bulkId,
      totalRecords: 1,
      contentUpdates: [{
        option: OPTIONS.EXPIRATION_DATE,
        actions: [
          { name: ACTIONS.FIND, updated: '2025-02-02' },
        ],
      }],
    });

    expect(body.bulkOperationRules[0].rule_details.actions[0].updated)
      .toBe('2025-02-02T23:59:59.000Z');
  });
});

describe('getStatisticalCodeActionIndex', () => {
  const baseFields = [
    { option: 'OTHER', actionsDetails: { actions: [] } },
    {
      option: OPTIONS.STATISTICAL_CODE,
      actionsDetails: { actions: [{ name: ACTIONS.ADD_TO_EXISTING }] },
    },
    {
      option: OPTIONS.STATISTICAL_CODE,
      actionsDetails: { actions: [{ name: ACTIONS.REMOVE_SOME }] },
    },
  ];

  it('finds the first matching action index', () => {
    expect(getStatisticalCodeActionIndex(baseFields, ACTIONS.ADD_TO_EXISTING)).toBe(1);
    expect(getStatisticalCodeActionIndex(baseFields, ACTIONS.REMOVE_SOME)).toBe(2);
    expect(getStatisticalCodeActionIndex(baseFields, 'NOPE')).toBe(-1);
  });
});

describe('getFieldsWithRules', () => {
  const fields = [
    { id: '1', option: OPTIONS.STATISTICAL_CODE },
    { id: '2', option: 'OTHER' },
    { id: '3', option: OPTIONS.STATISTICAL_CODE },
  ];

  it('when REMOVE_ALL on STATISTICAL_CODE, keeps only rowId or non-statistical', () => {
    const out = getFieldsWithRules({
      action: ACTIONS.REMOVE_ALL,
      option: OPTIONS.STATISTICAL_CODE,
      rowId: '3',
      fields,
    });
    expect(out).toEqual([
      fields[1],
      fields[2],
    ]);
  });

  it('otherwise returns original array', () => {
    expect(getFieldsWithRules({
      action: ACTIONS.ADD_TO_EXISTING,
      option: OPTIONS.STATISTICAL_CODE,
      rowId: '1',
      fields,
    })).toBe(fields);

    expect(getFieldsWithRules({
      action: ACTIONS.REMOVE_ALL,
      option: OPTIONS.ADMINISTRATIVE_NOTE,
      rowId: '1',
      fields,
    })).toBe(fields);
  });
});

describe('getActionsWithRules', () => {
  const DUMMY_ACTION = [{ name: ACTIONS.CHANGE_TYPE }];

  it('returns original actions when option is not STATISTICAL_CODE', () => {
    const row = { id: '1' };
    const fields = [
      { id: '1', option: OPTIONS.ITEM_NOTE, actionsDetails: { actions: [] } },
    ];
    const result = getActionsWithRules({
      row,
      option: OPTIONS.ITEM_NOTE,
      actions: DUMMY_ACTION,
      fields,
    });
    expect(result).toBe(DUMMY_ACTION);
  });

  it('when ADD_TO_EXISTING exists elsewhere, non-current row gets [placeholder, removeSome]', () => {
    // field 0 has ADD_TO_EXISTING, field 1 is our row
    const fields = [
      {
        id: '1',
        option: OPTIONS.STATISTICAL_CODE,
        actionsDetails: { actions: [{ name: ACTIONS.ADD_TO_EXISTING }] },
      },
      {
        id: '2',
        option: OPTIONS.STATISTICAL_CODE,
        actionsDetails: { actions: [] },
      },
    ];
    const row = fields[1];
    const result = getActionsWithRules({
      row,
      option: OPTIONS.STATISTICAL_CODE,
      actions: DUMMY_ACTION,
      fields,
    });
    expect(result).toEqual([getPlaceholder(), getRemoveSomeAction()]);
  });

  it('when ADD_TO_EXISTING is on the current row, returns original actions', () => {
    const fields = [
      {
        id: '1',
        option: OPTIONS.STATISTICAL_CODE,
        actionsDetails: { actions: [{ name: ACTIONS.ADD_TO_EXISTING }] },
      },
    ];
    const row = fields[0];
    const result = getActionsWithRules({
      row,
      option: OPTIONS.STATISTICAL_CODE,
      actions: DUMMY_ACTION,
      fields,
    });
    expect(result).toBe(DUMMY_ACTION);
  });

  it('when REMOVE_SOME exists elsewhere (and no ADD_TO_EXISTING), non-current row gets [placeholder, addAction]', () => {
    // field 0 has REMOVE_SOME, field 1 is our row
    const fields = [
      {
        id: '1',
        option: OPTIONS.STATISTICAL_CODE,
        actionsDetails: { actions: [{ name: ACTIONS.REMOVE_SOME }] },
      },
      {
        id: '2',
        option: OPTIONS.STATISTICAL_CODE,
        actionsDetails: { actions: [] },
      },
    ];
    const row = fields[1];
    const result = getActionsWithRules({
      row,
      option: OPTIONS.STATISTICAL_CODE,
      actions: DUMMY_ACTION,
      fields,
    });
    expect(result).toEqual([getPlaceholder(), getAddAction()]);
  });

  it('when REMOVE_SOME is on the current row, returns original actions', () => {
    const fields = [
      {
        id: '3',
        option: OPTIONS.STATISTICAL_CODE,
        actionsDetails: { actions: [{ name: ACTIONS.REMOVE_SOME }] },
      },
    ];
    const row = fields[0];
    const result = getActionsWithRules({
      row,
      option: OPTIONS.STATISTICAL_CODE,
      actions: DUMMY_ACTION,
      fields,
    });
    expect(result).toBe(DUMMY_ACTION);
  });

  it('ADD takes precedence over REMOVE when both exist elsewhere', () => {
    // Both actions present in field[0]; current row is field[1]
    const fields = [
      {
        id: '1',
        option: OPTIONS.STATISTICAL_CODE,
        actionsDetails: {
          actions: [
            { name: ACTIONS.ADD_TO_EXISTING },
            { name: ACTIONS.REMOVE_SOME },
          ],
        },
      },
      {
        id: '2',
        option: OPTIONS.STATISTICAL_CODE,
        actionsDetails: { actions: [] },
      },
    ];
    const row = fields[1];
    const result = getActionsWithRules({
      row,
      option: OPTIONS.STATISTICAL_CODE,
      actions: DUMMY_ACTION,
      fields,
    });
    // Because ADD_TO_EXISTING check runs first, we still get placeholder + removeSome
    expect(result).toEqual([getPlaceholder(), getRemoveSomeAction()]);
  });
});

describe('getOptionsWithRules', () => {
  const simpleOptions = [
    { value: OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT, label: 'Electronic access', parameters: [] },
    { value: OPTIONS.ADMINISTRATIVE_NOTE, label: 'Administrative note', parameters: [] },
  ];

  it('when no statistical code actions, keeps unused and current option', () => {
    const fields = [{ option: OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT }];
    const { maxRowsCount, filteredOptions } = getOptionsWithRules({
      fields,
      options: simpleOptions,
      item: { option: OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT },
    });

    expect(maxRowsCount).toBe(2);
    expect(filteredOptions).toEqual(simpleOptions);
  });

  it('omits previously used options if not the current row', () => {
    const fields = [{ option: OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT }];
    const { filteredOptions } = getOptionsWithRules({
      fields,
      options: simpleOptions,
      item: { option: OPTIONS.ADMINISTRATIVE_NOTE },
    });

    expect(filteredOptions).toEqual([
      { value: OPTIONS.ADMINISTRATIVE_NOTE, label: 'Administrative note', parameters: [] },
    ]);
  });
});

describe('getPreselectedValue', () => {
  it('swaps check‐in/out when action is DUPLICATE', () => {
    expect(getPreselectedValue(OPTIONS.CHECK_IN_NOTE, ACTIONS.DUPLICATE))
      .toBe(OPTIONS.CHECK_OUT_NOTE);
    expect(getPreselectedValue(OPTIONS.CHECK_OUT_NOTE, ACTIONS.DUPLICATE))
      .toBe(OPTIONS.CHECK_IN_NOTE);
  });
  it('otherwise returns empty string', () => {
    expect(getPreselectedValue(OPTIONS.ITEM_NOTE, ACTIONS.FIND)).toBe('');
  });
});

describe('getLabelByValue', () => {
  const items = [
    { value: 'find', label: 'Find' },
    { value: 'replaceWith', label: 'Replace with' },
  ];
  it('finds matching label', () => {
    expect(getLabelByValue(items, 'find')).toBe('Find');
  });
  it('returns undefined when missing', () => {
    expect(getLabelByValue(items, 'Remove some')).toBeUndefined();
  });
});

describe('sortWithoutPlaceholder', () => {
  const arr = [
    { label: 'Select action', value: '' },
    { label: 'Find', value: 'c' },
    { label: 'Remove some', value: 'b' },
    { label: 'Clear field', value: 'a' },
  ];

  it('leaves first element in place and sorts the rest by label', () => {
    const sorted = sortWithoutPlaceholder(arr);
    expect(sorted[0]).toBe(arr[0]);
    expect(sorted.slice(1).map(i => i.label)).toEqual([
      'Clear field', 'Find', 'Remove some',
    ]);
  });

  it('returns empty array when given none', () => {
    expect(sortWithoutPlaceholder([])).toEqual([]);
  });
});

describe('getMappedContentUpdates', () => {
  const options = [
    { value: 'OPT1', type: 't1' },
    { value: 'OPT2', type: 't2' },
  ];
  it('maps a single non-array action correctly', () => {
    const fields = [{
      option: 'OPT1',
      tenants: ['T1'],
      parameters: [{ key: 'p1', value: 'v1' }],
      actionsDetails: {
        actions: [
          { name: ACTIONS.FIND, value: 'VAL1', tenants: ['T1'] }
        ],
      },
    }];

    const result = getMappedContentUpdates(fields, options);
    expect(result).toHaveLength(1);
    const mapped = result[0];
    expect(mapped.option).toBe('t1');
    expect(mapped.tenants).toEqual(['T1']);
    expect(mapped.actions).toHaveLength(1);

    const act = mapped.actions[0];
    expect(act.type).toBe(ACTIONS.FIND);
    expect(act.initial).toBeNull();
    expect(act.updated).toBe('VAL1');
    expect(act.tenants).toEqual(['T1']);
    expect(act.updated_tenants).toEqual([]);
    expect(act.parameters).toEqual([{ key: 'p1', value: 'v1' }]);
  });
});

describe('folioFieldTemplate', () => {
  it('returns empty template without id', () => {
    expect(folioFieldTemplate()).toEqual({
      option: '',
      tenants: [],
      actionsDetails: [],
    });
  });
  it('includes given id when provided', () => {
    expect(folioFieldTemplate('id')).toEqual({
      id: 'id',
      option: '',
      tenants: [],
      actionsDetails: [],
    });
  });
});
