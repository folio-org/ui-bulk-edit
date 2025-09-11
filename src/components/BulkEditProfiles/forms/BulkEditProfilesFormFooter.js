import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, PaneFooter } from '@folio/stripes/components';

export const BulkEditProfilesFormFooter = ({ isSaveDisabled, onCancel, onSave }) => {
  return (
    <PaneFooter
      renderStart={(
        <Button
          buttonStyle="default mega"
          id="close-profiles-form"
          marginBottom0
          onClick={onCancel}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
      )}
      renderEnd={(
        <Button
          buttonStyle="primary mega"
          id="save-profile"
          marginBottom0
          onClick={onSave}
          type="submit"
          disabled={isSaveDisabled}
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
      )}
    />
  );
};

BulkEditProfilesFormFooter.propTypes = {
  isSaveDisabled: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
