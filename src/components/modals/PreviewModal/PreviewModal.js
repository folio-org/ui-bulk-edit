import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { PreviewModalFooter } from './PreviewModalFooter';
import { getInventoryResultsFormatterBase } from '../../../constants/formatters';
import { INVENTORY_COLUMNS_BASE } from '../../../constants';
import css from './PreviewModal.css';

const PreviewModal = () => {
  const formatter = getInventoryResultsFormatterBase();
  const visibleColumns = Object.keys(formatter);
  const columnMapping = INVENTORY_COLUMNS_BASE.reduce((acc, el) => {
    acc[el.value] = el.label;

    return acc;
  }, {});
  const columnWidths = {
    barcode: '110px',
    status: '110px',
    effectiveLocation: '160px',
    materialType: '100px',
    permanentLoanType: '120px',
    temporaryLoanType: '120px',
  };


  return (
    <Modal
      size="large"
      open
      label={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
      aria-label="PreviewModal"
      footer={<PreviewModalFooter />}
      dismissible
      onClose={() => null}
    >
      <MessageBanner type="warning">
        <FormattedMessage id="ui-bulk-edit.previewModal.message" values={{ count: 248 }} />
      </MessageBanner>

      <strong className={css.previewModalSubtitle}><FormattedMessage id="ui-bulk-edit.previewModal.previewToBeChanged" /></strong>

      <MultiColumnList
        contentData={[{
          active: true,
          barcode: '222',
          status: { name: 'active' },
          effectiveLocation: { name: 'effectiveLocation' },
          callNumber: 'callNumber',
          hrid: 'hrid',
          materialType: { name: 'materialType' },
          permanentLoanType: { name: 'permanentLoanType' },
          temporaryLoanType: { name: 'temporaryLoanType' },
        }]}
        columnWidths={columnWidths}
        columnMapping={columnMapping}
        formatter={formatter}
        visibleColumns={visibleColumns}
      />
    </Modal>
  );
};

export default PreviewModal;
