import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { useDerivativeModification } from '../../../../../hooks';
import { ACTION_PARAMETERS_KEY } from './helpers';
import css from '../BulkEditInApp.css';

export const AdditionalActionParameters = ({ action, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();

  useDerivativeModification({ onChange, actionIndex, action });

  const handleChange = (e) => {
    const { checked, name } = e.target;

    const parameters = action.parameters.map((parameter) => ({
      ...parameter,
      value: parameter.key === name ? checked : parameter.value,
    }));

    onChange({ actionIndex, value: parameters, fieldName: ACTION_PARAMETERS_KEY });
  };

  return (
    <div className={css.additionalParameters}>
      {action.parameters?.map((parameter) => (
        <Checkbox
          key={parameter.key}
          name={parameter.key}
          label={formatMessage({ id: `ui-bulk-edit.layer.action.apply.${parameter.key}` })}
          checked={parameter.value}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

AdditionalActionParameters.propTypes = {
  action: PropTypes.shape({
    controlType: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
    parameters: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.bool,
    })),
  }).isRequired,
  actionIndex: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
