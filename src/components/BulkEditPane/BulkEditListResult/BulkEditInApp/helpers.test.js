import { ACTIONS, OPTIONS } from '../../../../constants';

import { getContentUpdatesBody, getFieldsWithRules } from './helpers';

describe('ContentUpdatesForm helpers', () => {
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

    describe('getFieldsWithRules', () => {
      it('should return fields unchanged if option is not STATISTICAL_CODE', () => {
        const fields = [
          {
            option: OPTIONS.STATISTICAL_CODE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
          },
          {
            option: OPTIONS.ADMINISTRATIVE_NOTE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
          },
        ];

        const result = getFieldsWithRules({
          fields,
          option: OPTIONS.ADMINISTRATIVE_NOTE,
          value: ACTIONS.REMOVE_ALL, // value is irrelevant in this case
          rowIndex: 0,
        });

        expect(result).toEqual(fields);
      });

      it('should update the hidden property on each option when value is not REMOVE_ALL', () => {
        const fields = [
          {
            option: OPTIONS.STATISTICAL_CODE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
            actionsDetails: { actions: [{ name: ACTIONS.REMOVE_ALL }] },
          },
          {
            option: OPTIONS.ADMINISTRATIVE_NOTE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
            actionsDetails: { actions: [{ name: ACTIONS.REMOVE_ALL }] },
          },
        ];

        const result = getFieldsWithRules({
          fields,
          option: OPTIONS.STATISTICAL_CODE,
          value: 'SOME_OTHER_ACTION', // not equal to ACTIONS.REMOVE_ALL
          rowIndex: 0,
        });

        const expected = [
          {
            ...fields[0],
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false }, // updated because (false)
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
          },
          {
            ...fields[1],
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
          },
        ];

        expect(result).toEqual(expected);
      });

      it('should remove non-current rows with STATISTICAL_CODE when value equals REMOVE_ALL', () => {
        const fields = [
          {
            option: OPTIONS.STATISTICAL_CODE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
            actionsDetails: { actions: [{ name: ACTIONS.REMOVE_ALL }] },
            id: 1,
          },
          {
            option: OPTIONS.STATISTICAL_CODE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
            actionsDetails: { actions: [{ name: ACTIONS.REMOVE_ALL }] },
            id: 2,
          },
          {
            option: OPTIONS.ADMINISTRATIVE_NOTE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
            actionsDetails: { actions: [{ name: ACTIONS.REMOVE_ALL }] },
            id: 3,
          },
        ];

        const result = getFieldsWithRules({
          fields,
          option: OPTIONS.STATISTICAL_CODE,
          value: ACTIONS.REMOVE_ALL,
          rowIndex: 1,
        });

        const expected = [
          {
            ...fields[1],
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
          },
          {
            ...fields[2],
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
          },
        ];

        expect(result).toEqual(expected);
      });

      it('should remove first empty row when REMOVE_ALL selected and max count of fields added', () => {
        const fields = [
          {
            option: OPTIONS.STATISTICAL_CODE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
            actionsDetails: { actions: [{ name: ACTIONS.REMOVE_ALL }] },
            id: 1,
          },
          {
            option: '',
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
            actionsDetails: { actions: [{ name: '' }] },
            id: 2,
          },
          {
            option: '',
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: false },
            ],
            actionsDetails: { actions: [{ name: '' }] },
            id: 3,
          },
        ];

        const result = getFieldsWithRules({
          fields,
          option: OPTIONS.STATISTICAL_CODE,
          value: ACTIONS.REMOVE_ALL,
          rowIndex: 0,
        });

        // fields[1] - first empty row removed
        const expected = [
          fields[0],
          fields[2]
        ];

        expect(result).toEqual(expected);
      });

      it('should update the hidden property on each option when ADD_TO_EXISTING and REMOVE_SOME selected', () => {
        const fields = [
          {
            option: OPTIONS.STATISTICAL_CODE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
            actionsDetails: { actions: [{ name: ACTIONS.ADD_TO_EXISTING }] },
          },
          {
            option: OPTIONS.STATISTICAL_CODE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
            actionsDetails: { actions: [{ name: ACTIONS.REMOVE_SOME }] },
          },
          {
            option: OPTIONS.ADMINISTRATIVE_NOTE,
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
          },
        ];

        const result = getFieldsWithRules({
          fields,
          option: OPTIONS.STATISTICAL_CODE,
          value: 'SOME_OTHER_ACTION',
          rowIndex: 0,
        });

        const expected = [
          {
            ...fields[0],
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
          },
          {
            ...fields[1],
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: false },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
          },
          {
            ...fields[2],
            options: [
              { value: OPTIONS.STATISTICAL_CODE, hidden: true },
              { value: OPTIONS.ADMINISTRATIVE_NOTE, hidden: true },
            ],
          },
        ];

        expect(result).toEqual(expected);
      });


      it('should return an empty array when fields array is empty', () => {
        const result = getFieldsWithRules({
          fields: [],
          option: OPTIONS.STATISTICAL_CODE,
          value: ACTIONS.REMOVE_ALL,
          rowIndex: 0,
        });

        expect(result).toEqual([]);
      });
    });
  });
});
