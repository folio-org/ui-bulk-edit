import { FormattedUTCDate } from '@folio/stripes/components';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import { CAPABILITIES, CUSTOM_ENTITY_COLUMNS } from '../constants';
import { getMappedTableData, DATA_TYPES } from './mappers';
import {
  ElectronicAccessTable
} from '../components/BulkEditPane/BulkEditListResult/PreviewLayout/ElectronicAccessTable/ElectronicAccessTable';


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
          selected: true,
        }],
        contentData: [{
          [uuidColumn.value]: row[0],
        }],
      });
    });

    it('should convert date string to FolioFormattedTime', () => {
      const dateColumn = {
        value: 'date',
        label: 'date',
        visible: true,
        dataType: DATA_TYPES.DATE_TIME,
      };
      const row = ['2023-03-18 23:59:59.000Z'];
      const data = {
        header: [dateColumn],
        rows: [{ row }],
      };

      const { contentData } = getMappedTableData({ data, intl, capabilities: CAPABILITIES.USER });

      expect(contentData[0][dateColumn.value].type).toEqual(FolioFormattedTime);
    });

    it('should convert user expiration date string to FormattedUTCDate', () => {
      const expirationColumn = {
        value: CUSTOM_ENTITY_COLUMNS.EXPIRATION_DATE,
        label: CUSTOM_ENTITY_COLUMNS.EXPIRATION_DATE,
        visible: true,
        dataType: DATA_TYPES.DATE_TIME,
      };
      const row = ['2023-03-18 23:59:59.000Z'];
      const data = {
        header: [expirationColumn],
        rows: [{ row }],
      };

      const { contentData } = getMappedTableData({ data, intl, capabilities: CAPABILITIES.USER });

      expect(contentData[0][expirationColumn.value].type).toEqual(FormattedUTCDate);
    });

    it('should not convert date string to FolioFormattedTime when value is empty', () => {
      const dateColumn = {
        value: 'date',
        label: 'date',
        visible: true,
        dataType: DATA_TYPES.DATE_TIME,
      };
      const row = [''];
      const data = {
        header: [dateColumn],
        rows: [{ row }],
      };

      const { contentData } = getMappedTableData({ data, intl, capabilities: CAPABILITIES.USER });

      expect(contentData[0][dateColumn.value]).toBe('');
    });

    it('should convert user status value to translated', () => {
      const statusColumn = {
        value: CUSTOM_ENTITY_COLUMNS.USER_STATUS,
        label: CUSTOM_ENTITY_COLUMNS.USER_STATUS,
        visible: true,
        dataType: DATA_TYPES.DATE_TIME,
      };
      const row = ['true'];
      const data = {
        header: [statusColumn],
        rows: [{ row }],
      };

      const { contentData } = getMappedTableData({ data, intl, capabilities: CAPABILITIES.USER });

      expect(contentData[0][statusColumn.value].props.id).toBe('ui-bulk-edit.list.preview.table.status.true');
    });

    it('should render Electronic access as a table', () => {
      const electronicAccessColumn = {
        value: CUSTOM_ENTITY_COLUMNS.ELECTRONIC_ACCESS,
        label: CUSTOM_ENTITY_COLUMNS.ELECTRONIC_ACCESS,
        visible: true,
      };
      const row = ['true'];
      const data = {
        header: [electronicAccessColumn],
        rows: [{ row }],
      };

      const { contentData } = getMappedTableData({ data, intl, capabilities: CAPABILITIES.HOLDING });

      expect(contentData[0][electronicAccessColumn.value].type).toEqual(ElectronicAccessTable);
    });
  });
});
