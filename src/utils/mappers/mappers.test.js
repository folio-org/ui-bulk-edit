import {
  CAPABILITIES,
} from '../../constants';
import { getFormattedColumnsDate } from '../date';

import { getMappedTableData, DATA_TYPES } from './mappers';

jest.mock('../date', () => ({
  getFormattedColumnsDate: jest.fn().mockReturnValue('dateString'),
}));

const intl = {
  formatMessage: jest.fn(),
};

describe('mappers', () => {
  describe('getMappedTableData', () => {
    it('should return empty table data when data is not defined', () => {
      expect(getMappedTableData({ data: undefined })).toEqual({
        contentData: null,
        formatter: null,
        columns: [],
      });
    });

    it('should return correct table data for entity type', () => {
      const uuidTranslation = 'UUID';
      const uuidColumn = {
        value: 'uuid',
        label: 'uuid',
        visible: true,
        dataType: DATA_TYPES.STRING,
      };
      const row = ['uuid'];
      const data = {
        header: [uuidColumn],
        rows: [{ row }],
      };

      intl.formatMessage.mockClear().mockReturnValue(uuidTranslation);

      expect(getMappedTableData({ data, intl, capabilities: CAPABILITIES.USER })).toEqual({
        columnMapping: { [uuidColumn.value]: uuidTranslation },
        columns: [{
          label: uuidColumn.label,
          value: uuidColumn.value,
          disabled: false,
          selected: false,
        }],
        contentData: [{
          [uuidColumn.value]: row[0],
        }],
      });
    });

    it('should convert date string to format', () => {
      const dateTranslation = 'Date';
      const dateColumn = {
        value: 'date',
        label: 'data',
        visible: true,
        dataType: DATA_TYPES.DATE_TIME,
      };
      const row = ['2023-03-18 23:59:59.000Z'];
      const data = {
        header: [dateColumn],
        rows: [{ row }],
      };

      getFormattedColumnsDate.mockClear();
      intl.formatMessage.mockClear().mockReturnValue(dateTranslation);

      getMappedTableData({ data, intl, capabilities: CAPABILITIES.USER });

      expect(getFormattedColumnsDate).toHaveBeenCalledWith(row[0]);
    });
  });
});
