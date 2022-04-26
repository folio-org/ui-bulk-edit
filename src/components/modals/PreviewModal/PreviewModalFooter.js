import { Button } from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import css from './PreviewModal.css';

export const PreviewModalFooter = ({ onKeepEditing, onDownloadPreview, onSave }) => {
  return (
    <div className={css.previewModalFooter}>
      <Button onClick={onKeepEditing}>
        <FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />
      </Button>
      <Button onClick={onDownloadPreview}>
        <FormattedMessage id="ui-bulk-edit.previewModal.downloadPreview" />
      </Button>
      <Button onClick={onSave} buttonStyle="primary">
        <FormattedMessage id="ui-bulk-edit.previewModal.saveAndClose" />
      </Button>
    </div>
  );
};

PreviewModalFooter.propTypes = {
  onKeepEditing: PropTypes.func,
  onDownloadPreview: PropTypes.func,
  onSave: PropTypes.func,
};





