import React from 'react';
import { Checkbox, Col } from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { CAPABILITIES, CONTROL_TYPES } from '../../../../../constants';
import { WITH_ITEMS_VALUE_KEY } from './helpers';

export const AdditionalActions = ({ action, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const capability = search.get('capabilities');

  const renderSuppressCheckbox = () => {
    return capability === CAPABILITIES.HOLDING && action.type === CONTROL_TYPES.SUPPRESS_CHECKBOX && (
      <Col xs={2} sm={2}>
        <Checkbox
          label={formatMessage({ id: 'ui-bulk-edit.layer.action.applyItems' })}
          value={action.value}
          onChange={e => onChange({ actionIndex, value: e.target.checked, fieldName: WITH_ITEMS_VALUE_KEY })}
        />
      </Col>
    );
  };


  return (
    <>
      {renderSuppressCheckbox()}
    </>
  );
};

AdditionalActions.propTypes = {
  action: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
