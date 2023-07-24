import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import css from '../PermissionsModal.css';

export const PermissionsModalFooter = ({ selectedCount, onCancel, onSave }) => {
  return (
    <div className={css.PermissionsModalFooter}>
      <Button
        id="clickable-permissions-modal-cancel"
        onClick={onCancel}
        marginBottom0
      >
        <FormattedMessage id="ui-bulk-edit.permissionsModal.cancel" />
      </Button>
      <div>
        <FormattedMessage
          id="ui-bulk-edit.permissionsModal.totalSelected"
          values={{ count: selectedCount }}
        />
      </div>
      <Button
        id="clickable-permissions-modal-save"
        marginBottom0
        buttonStyle="primary"
        onClick={onSave}
      >
        <FormattedMessage id="ui-bulk-edit.permissionsModal.save" />
      </Button>
    </div>
  );
};

PermissionsModalFooter.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
